import type { Service } from '../types.ts'

export function makeService(overrides: Partial<Service> = {}): Service {
  return {
    id: 'svc-1',
    type: 'ambulance',
    title: 'Berlin Mitte Rapid Response',
    description: 'Emergency ambulance unit serving central Berlin.',
    location: 'Mitte, Berlin, Germany',
    imageUrl: '/images/ambulance-1.svg',
    lat: 52.52,
    lng: 13.4,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}
