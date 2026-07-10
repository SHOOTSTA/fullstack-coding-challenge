import { apiFetch } from './client.ts'
import type { Service, ServiceFilter, ServiceInput, ServiceListResponse } from '../types.ts'

export interface FetchServicesParams {
  type?: ServiceFilter
  q?: string
  page?: number
  limit?: number
}

export function fetchServices(params: FetchServicesParams = {}): Promise<ServiceListResponse> {
  const search = new URLSearchParams()
  if (params.type && params.type !== 'all') search.set('type', params.type)
  if (params.q) search.set('q', params.q)
  search.set('page', String(params.page ?? 1))
  search.set('limit', String(params.limit ?? 10))

  return apiFetch<ServiceListResponse>(`/api/services?${search.toString()}`)
}

export function createService(input: ServiceInput): Promise<Service> {
  return apiFetch<Service>('/api/services', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateService(id: string, input: ServiceInput): Promise<Service> {
  return apiFetch<Service>(`/api/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deleteService(id: string): Promise<void> {
  return apiFetch<void>(`/api/services/${id}`, { method: 'DELETE' })
}
