import React, { Component, useEffect, useState } from "react";


export function getUserLocation({setMapCenter, setMapMarkers, mapMarkers}) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async(position) =>{
      let { coords } = position;
      let { latitude, longitude } = coords;
      console.log({ lat: latitude, lng: longitude });
      setMapCenter({lat: latitude, lng: longitude})
      setMapMarkers([...mapMarkers, ...[{lat: latitude, lng: longitude}]])
      /* Get bouy data? */
      const res = await fetch(`${process.env.API_SERVER}/wavedata/lat/${latitude}/lng/${longitude}`)
      console.log(res)

    });
  } else {
    alert("Sorry cannot get location");
  }
}

/* Helpers */
function do_something(lat, lng) {
  console.log({ lat, lng });
  return { lat, lng };
}


export function useMarkers(){
  let [mapMarkers, setMapMarkers] = useState([
    { lat: 44.8338944, lng: -122.8435008 }
  ]);


  return [mapMarkers, setMapMarkers]
}

export function useLocation(){
  let [mapCenter, setMapCenter] = useState({
    lat: 44.8338944, lng: -122.8435008
  });


  return [mapCenter, setMapCenter]
}

export function useBouys(){
  let [bouys, setBouys] = useState([]);


  return [bouys, setBouys]
}


