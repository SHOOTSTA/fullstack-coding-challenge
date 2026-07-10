import styled, { keyframes } from 'styled-components'
import type { Service } from '../types.ts'
import { ServiceCard } from './ServiceCard.tsx'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`

const SkeletonCard = styled.div`
  height: 280px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(90deg, #f0f2f5 0px, #f8f9fb 40px, #f0f2f5 80px);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`

const StateWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 64px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
  }
`

const RetryButton = styled.button`
  padding: 8px 18px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

interface ServiceListProps {
  items: Service[]
  loading: boolean
  error: string | null
  onRetry: () => void
  getDistanceKm?: (service: Service) => number | undefined
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
}

export function ServiceList({ items, loading, error, onRetry, getDistanceKm, onEdit, onDelete }: ServiceListProps) {
  if (loading) {
    return (
      <Grid role="status" aria-label="Loading services">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </Grid>
    )
  }

  if (error) {
    return (
      <StateWrap role="alert">
        <span style={{ fontSize: 40 }} aria-hidden="true">
          ⚠️
        </span>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <RetryButton type="button" onClick={onRetry}>
          Try again
        </RetryButton>
      </StateWrap>
    )
  }

  if (items.length === 0) {
    return (
      <StateWrap>
        <span style={{ fontSize: 40 }} aria-hidden="true">
          🔍
        </span>
        <h3>No results found</h3>
        <p>Try a different search term or filter.</p>
      </StateWrap>
    )
  }

  return (
    <Grid>
      {items.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          distanceKm={getDistanceKm?.(service)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Grid>
  )
}
