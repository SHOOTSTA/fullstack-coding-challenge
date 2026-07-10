export type ServiceType = 'ambulance' | 'doctor'

export interface Service {
  id: string
  type: ServiceType
  title: string
  description: string
  location: string
  imageUrl: string | null
  lat: number | null
  lng: number | null
  createdAt: string
  updatedAt: string
}

export interface ServiceInput {
  type: ServiceType
  title: string
  description: string
  location: string
  imageUrl?: string | null
  lat?: number | null
  lng?: number | null
}

export interface ListParams {
  type?: ServiceType
  q?: string
  page: number
  limit: number
}

export interface ListResult {
  data: Service[]
  page: number
  limit: number
  total: number
  totalPages: number
  totals: {
    all: number
    ambulance: number
    doctor: number
  }
}
