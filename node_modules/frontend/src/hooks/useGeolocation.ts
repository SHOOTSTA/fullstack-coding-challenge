import { useCallback, useState } from 'react'

export interface Coordinates {
  lat: number
  lng: number
}

interface GeolocationState {
  coords: Coordinates | null
  loading: boolean
  error: string | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    loading: false,
    error: null,
  })

  const request = useCallback((onSuccess?: (coords: Coordinates) => void) => {
    if (!navigator.geolocation) {
      setState({ coords: null, loading: false, error: 'Geolocation is not supported by this browser.' })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude }
        setState({ coords, loading: false, error: null })
        onSuccess?.(coords)
      },
      (error) => {
        setState({ coords: null, loading: false, error: error.message || 'Unable to retrieve your location.' })
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [])

  const clear = useCallback(() => {
    setState({ coords: null, loading: false, error: null })
  }, [])

  return { ...state, request, clear }
}
