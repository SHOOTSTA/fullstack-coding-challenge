const EARTH_RADIUS_KM = 6371

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180
}

/** Great-circle distance between two lat/lng points, in kilometers. */
export function haversineDistanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): number {
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)
  const lat1 = toRadians(from.lat)
  const lat2 = toRadians(to.lat)

  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_KM * c
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}
