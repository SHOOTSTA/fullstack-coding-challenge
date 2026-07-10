import { renderHook, waitFor, act } from '@testing-library/react'
import { useServices } from './useServices.ts'
import type { ServiceListResponse } from '../types.ts'

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response
}

const emptyList: ServiceListResponse = {
  data: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  totals: { all: 0, ambulance: 0, doctor: 0 },
}

describe('useServices', () => {
  let fetchMock: jest.Mock

  beforeEach(() => {
    fetchMock = jest.fn()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  it('starts in a loading state and resolves with data', async () => {
    fetchMock.mockResolvedValue(jsonResponse(emptyList))

    const { result } = renderHook(() => useServices({ page: 1, limit: 10 }))

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.result).toEqual(emptyList)
    expect(result.current.error).toBeNull()
  })

  it('surfaces an error message when the request fails', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Boom' }, 500))

    const { result } = renderHook(() => useServices({ page: 1, limit: 10 }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Boom')
    expect(result.current.result).toBeNull()
  })

  it('refetch triggers a new request', async () => {
    fetchMock.mockResolvedValue(jsonResponse(emptyList))

    const { result } = renderHook(() => useServices({ page: 1, limit: 10 }))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(fetchMock).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.refetch()
    })

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
  })
})
