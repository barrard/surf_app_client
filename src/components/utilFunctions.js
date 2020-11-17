import { useState } from 'react'

export function getUserLocation ({
  setUserLocation

}) {
  console.log('Get user location')
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const { coords } = position
      const { latitude, longitude } = coords
      // console.log({ lat: latitude, lng: longitude })
      setUserLocation({ lat: latitude, lng: longitude })
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
      `${process.env.API_SERVER}/wavedata/lat/${lat}/lng/${lng}`,{
        credentials:'include'
      }
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
  const locations = []
  const [mapCenter, setMapCenter] = useState(null/* {
    lat: 0,
    lng: 0
  } */)

  function checkLatLng ({ lat, lng }) {
    let flag = true
    console.log({ lat, lng })
    console.log({ mapCenter })
    locations.forEach(location => {
      const dist = distance(
        location.lat, location.lng,
        lat, lng, 'M'
      )
      console.log({ dist })
      if (dist < 400) flag = false
    })
    if (flag) {
      locations.push({ lat, lng })
      setMapCenter({ lat, lng })
    }
  }

  return [mapCenter, checkLatLng]
}

function distance (lat1, lon1, lat2, lon2, unit) {
  if ((lat1 === lat2) && (lon1 === lon2)) {
    return 0
  } else {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === 'K') { dist = dist * 1.609344 }
    if (unit === 'N') { dist = dist * 0.8684 }
    return dist
  }
}

export function parseDegrees (degrees) {
  let direction
  if (degrees > 337 || degrees < 23) direction = 'N'
  else if (degrees > 22 && degrees < 68) direction = 'NE'
  else if (degrees > 67 && degrees < 113) direction = 'E'
  else if (degrees > 112 && degrees < 158) direction = 'SE'
  else if (degrees > 157 && degrees < 203) direction = 'S'
  else if (degrees > 202 && degrees < 248) direction = 'SW'
  else if (degrees > 247 && degrees < 293) direction = 'W'
  else if (degrees > 292 && degrees < 338) direction = 'NW'
  // console.log({ direction, degrees })
  return direction
}
