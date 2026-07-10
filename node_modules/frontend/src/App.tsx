import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Header } from './components/Header.tsx'
import { Tabs } from './components/Tabs.tsx'
import { SearchBar } from './components/SearchBar.tsx'
import { NearMeButton } from './components/NearMeButton.tsx'
import { ServiceList } from './components/ServiceList.tsx'
import { Pagination } from './components/Pagination.tsx'
import { ServiceFormModal } from './components/ServiceFormModal.tsx'
import { ConfirmDialog } from './components/ConfirmDialog.tsx'
import { useServices } from './hooks/useServices.ts'
import type { Coordinates } from './hooks/useGeolocation.ts'
import { createService, deleteService, updateService } from './api/services.ts'
import { ApiError } from './api/client.ts'
import { haversineDistanceKm } from './utils/distance.ts'
import type { Service, ServiceFilter, ServiceInput } from './types.ts'

const PAGE_SIZE = 10
const NEAR_ME_FETCH_LIMIT = 500

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px clamp(16px, 4vw, 48px) 64px;
`

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`

type FormTarget = 'create' | Service | null

function App() {
  const [filter, setFilter] = useState<ServiceFilter>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [nearMe, setNearMe] = useState<Coordinates | null>(null)

  const [formTarget, setFormTarget] = useState<FormTarget>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { result, loading, error, refetch } = useServices({
    type: filter,
    q: search,
    page: nearMe ? 1 : page,
    limit: nearMe ? NEAR_ME_FETCH_LIMIT : PAGE_SIZE,
  })

  const totals = result?.totals ?? { all: 0, ambulance: 0, doctor: 0 }

  const { pageItems, totalPages, getDistanceKm } = useMemo(() => {
    if (!result) {
      return { pageItems: [] as Service[], totalPages: 1, getDistanceKm: undefined }
    }

    if (!nearMe) {
      return { pageItems: result.data, totalPages: result.totalPages, getDistanceKm: undefined }
    }

    const distanceOf = (s: Service) =>
      s.lat != null && s.lng != null ? haversineDistanceKm(nearMe, { lat: s.lat, lng: s.lng }) : Number.POSITIVE_INFINITY

    const sorted = [...result.data].sort((a, b) => distanceOf(a) - distanceOf(b))
    const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
    const start = (page - 1) * PAGE_SIZE
    const sliced = sorted.slice(start, start + PAGE_SIZE)

    return {
      pageItems: sliced,
      totalPages: pages,
      getDistanceKm: (s: Service) => {
        const d = distanceOf(s)
        return Number.isFinite(d) ? d : undefined
      },
    }
  }, [result, nearMe, page])

  useEffect(() => {
    // Deleting the last record on a page (or narrowing a filter) can leave `page`
    // pointing past the new totalPages; the fetch itself depends on `page`, so this
    // can't be expressed as plain derived render output and needs a real effect.
    if (!loading && page > totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(totalPages)
    }
  }, [loading, page, totalPages])

  const handleFilterChange = (next: ServiceFilter) => {
    setFilter(next)
    setPage(1)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleLocated = (coords: Coordinates) => {
    setNearMe(coords)
    setPage(1)
  }

  const handleClearNearMe = () => {
    setNearMe(null)
    setPage(1)
  }

  const handleFormSubmit = async (input: ServiceInput) => {
    setSubmitting(true)
    setFormError(null)
    try {
      if (formTarget === 'create') {
        await createService(input)
      } else if (formTarget) {
        await updateService(formTarget.id, input)
      }
      setFormTarget(null)
      refetch()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to save this record. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteService(deleteTarget.id)
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : 'Failed to delete this record. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Header totals={totals} onAddClick={() => setFormTarget('create')} />
      <Main>
        <Toolbar>
          <Tabs active={filter} onChange={handleFilterChange} totals={totals} />
          <SearchBar onSearch={handleSearch} />
          <NearMeButton active={Boolean(nearMe)} onLocated={handleLocated} onClear={handleClearNearMe} />
        </Toolbar>

        <ServiceList
          items={pageItems}
          loading={loading}
          error={error}
          onRetry={refetch}
          getDistanceKm={getDistanceKm}
          onEdit={(service) => setFormTarget(service)}
          onDelete={(service) => setDeleteTarget(service)}
        />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Main>

      {formTarget && (
        <ServiceFormModal
          initial={formTarget === 'create' ? null : formTarget}
          submitting={submitting}
          serverError={formError}
          onClose={() => {
            setFormTarget(null)
            setFormError(null)
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete record"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`}
          busy={deleting}
          error={deleteError}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setDeleteTarget(null)
            setDeleteError(null)
          }}
        />
      )}
    </>
  )
}

export default App
