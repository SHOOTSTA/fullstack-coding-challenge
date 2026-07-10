export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function resolveImageUrl(path: string | null): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE_URL}${path}`
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  if (res.status === 204) {
    return undefined as T
  }

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    const message = (body && typeof body === 'object' && 'message' in body ? String(body.message) : null) ?? 'Request failed'
    throw new ApiError(res.status, message)
  }

  return body as T
}
