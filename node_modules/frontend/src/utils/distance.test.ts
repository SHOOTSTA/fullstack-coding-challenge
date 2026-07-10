import { formatDistanceKm, haversineDistanceKm } from './distance.ts'

describe('haversineDistanceKm', () => {
  it('returns 0 for identical coordinates', () => {
    const point = { lat: 52.52, lng: 13.4 }
    expect(haversineDistanceKm(point, point)).toBeCloseTo(0, 5)
  })

  it('computes the known distance between Berlin and Paris', () => {
    const berlin = { lat: 52.520008, lng: 13.404954 }
    const paris = { lat: 48.8534, lng: 2.3488 }

    // Real-world great-circle distance is ~878 km.
    expect(haversineDistanceKm(berlin, paris)).toBeGreaterThan(860)
    expect(haversineDistanceKm(berlin, paris)).toBeLessThan(900)
  })
})

describe('formatDistanceKm', () => {
  it('formats sub-kilometer distances in meters', () => {
    expect(formatDistanceKm(0.25)).toBe('250 m')
  })

  it('formats kilometer distances with one decimal', () => {
    expect(formatDistanceKm(12.34)).toBe('12.3 km')
  })
})
