import React, { Component, useEffect, useState, useRef } from "react";
// import Link from "next/link";
import Head from "next/head";
// import Container from "@material-ui/core/Container";
// import Grid from "@material-ui/core/Grid";
// import { MyMap } from "../components/Maps/RGM.js";
// import  MyMap from "../components/Maps/RGM_API.js";
import  Leaf_map from "../src/components/Maps/Leaflet_Map.js";
import lStyles from 'leaflet/dist/leaflet.css';

// const Leaf_map = dynamic(import("../components/Maps/Leaflet_Map.js"), {
//   ssr: false
// });
// import dynamic from "next/dynamic";

import {
  getUserLocation,
  useBouys,
  useLocation,
  get_nearby_bouy_data
} from "../src/components/utilFunctions.js";

const Home = () => {
  // const google = window.google;

  let [userLocation, setUserLocation] = useLocation();
  console.log({ userLocation });
  let [bouyMarkers, setBouyMarkers] = useBouys({});
  let map_ref = useRef(null)
  useEffect(() => {
    console.log("use efect");
    getUserLocation({ setUserLocation, setBouyMarkers, bouyMarkers });
  }, []);
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
<Leaf_map latLng={userLocation} buoy_data={bouyMarkers}/>
      {/* <MyMap
        map_ref={map_ref}
        markers={bouyMarkers}
        center={userLocation}
        handleLabelClick={console.log}
        handleClick={e =>
          get_buoy_data(e, setBouyMarkers, bouyMarkers, setUserLocation, map_ref)
        }
      /> */}


    </div>
  );
};

export default Home;

// Home.getInitialProps = async(ctx)=>{

//   /*
//   err
// req
// res
// pathname
// query
// asPath
// AppTree

//   */
//  if(ctx.res){
//    console.log(process.env.GOOGLE)
//  }

//   return{GAPI:process.env.GOOGLE}
// }

function get_buoy_data(e, setBouyMarkers, bouyMarkers, setUserLocation, map) {
  console.log(map)
  console.log({google})
  console.log(google)
  console.log(e.latLng.lat());
  console.log(e.latLng.lng());
  /* try pan zoom */
  get_nearby_bouy_data(
    e.latLng.lat(),
    e.latLng.lng(),
    setBouyMarkers,
    bouyMarkers,
    setUserLocation
  );
}
