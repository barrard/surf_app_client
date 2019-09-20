import React, { Component, useEffect, useState } from "react";

export function getUserLocation({
  setUserLocation,
  setBouyMarkers,
  bouyMarkers
}) {
  console.log('Get user location')
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async position => {
      let { coords } = position;
      let { latitude, longitude } = coords;
      console.log({ lat: latitude, lng: longitude });
      // /* Get bouy data? */
      get_nearby_bouy_data(latitude, longitude, setBouyMarkers, bouyMarkers, setUserLocation);
    });
  } else {
    alert("Sorry cannot get location");
  }
}

/* Helpers */
export async function get_nearby_bouy_data(
  lat,
  lng,
  setBouyMarkers,
  bouyMarkers,   setUserLocation

) {
  console.log({lat, lng})
  const res = await fetch(
    `${process.env.API_SERVER}/wavedata/lat/${lat}/lng/${lng}`
  );
  setUserLocation({ lat, lng });

  let { obshder_array, station_id_obj } = await res.json();
  console.log({ obshder_array, station_id_obj });
  setBouyMarkers( {...bouyMarkers,...station_id_obj});
}

export function useBouys() {
  let [bouyMarkers, setBouyMarkers] = useState({});

  return [bouyMarkers, setBouyMarkers];
}

export function useLocation() {
  let [mapCenter, setMapCenter] = useState({
    lat: 44.8338944,
    lng: -122.8435008
  });

  return [mapCenter, setMapCenter];
}
