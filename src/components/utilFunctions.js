import { useState } from 'react'

export function getUserLocation ({
  setUserLocation

}) {
  console.log('Get user location')
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async position => {
      const { coords } = position
      const { latitude, longitude } = coords
      console.log({ lat: latitude, lng: longitude })
      return setUserLocation({ lat: latitude, lng: longitude })
    })
  } else {
    alert('Sorry cannot get location')
  }
}

/* Helpers */
export async function get_nearby_bouy_data (
  lat,
  lng,
  bouyMarkers,
  setBouyMarkers
) {
  console.log({ lat, lng })
  try {
    const res = await fetch(
      `${process.env.API_SERVER}/wavedata/lat/${lat}/lng/${lng}`
    )
    const { obshder_array, station_id_obj } = await res.json()
    console.log({ obshder_array, station_id_obj })
    console.log({ bouyMarkers })
    setBouyMarkers({ ...bouyMarkers, ...station_id_obj })
  } catch (err) {
    console.error('err')
    console.log(err)
    console.log('Cannot get Buoy data')
  }
}

export function useBouys () {
  const [bouyMarkers, setBouyMarkers] = useState(null)
  console.log({ bouyMarkers })

  return [bouyMarkers, setBouyMarkers]
}

export function useLocation () {
  const [mapCenter, setMapCenter] = useState(null/* {
    lat: 0,
    lng: 0
  } */)

  return [mapCenter, setMapCenter]
}
