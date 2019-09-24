import React, { Component, useEffect, useState } from "react";

export function getUserLocation({
  setUserLocation,

}) {
  console.log("Get user location");
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async position => {
      let { coords } = position;
      let { latitude, longitude } = coords;
      console.log({ lat: latitude, lng: longitude });
      return setUserLocation({ lat: latitude, lng: longitude })
      // /* Get bouy data? */
      get_nearby_bouy_data(
        latitude,
        longitude,
        bouyMarkers,
        setBouyMarkers,
        setUserLocation
      );
    });
  } else {
    alert("Sorry cannot get location");
  }
}

/* Helpers */
export async function get_nearby_bouy_data(
  lat,
  lng,
  bouyMarkers,
  setBouyMarkers,
  // setUserLocation
) {
  console.log({ lat, lng });
  try {
    const res = await fetch(
      `${process.env.API_SERVER}/wavedata/lat/${lat}/lng/${lng}`
    );

    let { obshder_array, station_id_obj } = await res.json();
    console.log({ obshder_array, station_id_obj });
    console.log({bouyMarkers})
    // if(bouyMarkers){
      setBouyMarkers({ ...bouyMarkers, ...station_id_obj });

    // }else{
      // setBouyMarkers({ ...station_id_obj });

    // }
    // setUserLocation({ lat, lng });
    // console.log({bouyMarkers})
  } catch (err) {
    console.error("err");
    console.log(err);
    console.log("Cannot get Buoy data");
  }
}

export function useBouys() {
  let [bouyMarkers, setBouyMarkers] = useState(null);
  console.log({bouyMarkers})

  return [bouyMarkers, setBouyMarkers];
}

export function useLocation() {
  let [mapCenter, setMapCenter] = useState(null/* {
    lat: 0,
    lng: 0
  } */);

  return [mapCenter, setMapCenter];
}
