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

export interface ServiceListResponse {
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

export type ServiceFilter = 'all' | ServiceType
