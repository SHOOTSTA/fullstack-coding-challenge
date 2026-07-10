import { useCallback, useEffect, useState } from 'react'
import { fetchServices, type FetchServicesParams } from '../api/services.ts'
import { ApiError } from '../api/client.ts'
import type { ServiceListResponse } from '../types.ts'

export function useServices(params: FetchServicesParams) {
  const [result, setResult] = useState<ServiceListResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [completedKey, setCompletedKey] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const requestKey = `${JSON.stringify(params)}:${reloadToken}`
  const loading = completedKey !== requestKey

  useEffect(() => {
    let ignore = false

    fetchServices(params)
      .then((data) => {
        if (ignore) return
        setResult(data)
        setError(null)
        setCompletedKey(requestKey)
      })
      .catch((err: unknown) => {
        if (ignore) return
        setResult(null)
        setError(err instanceof ApiError ? err.message : 'Failed to load services. Please try again.')
        setCompletedKey(requestKey)
      })

    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey])

  const refetch = useCallback(() => setReloadToken((t) => t + 1), [])

  return { result, loading, error, refetch }
}
