import React, { Component, useEffect, useState, useRef } from "react";
// import Link from "next/link";
import Head from "next/head";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
// import { MyMap } from "../components/Maps/RGM.js";
// import  MyMap from "../components/Maps/RGM_API.js";
import Leaf_map from "../src/components/Maps/Leaflet_Map.js";
import lStyles from "leaflet/dist/leaflet.css";
import { colors_legend } from "../src/components/colors/colors";

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
  // console.log({ userLocation });
  let [bouyMarkers, setBouyMarkers] = useBouys();
  useEffect(()=> console.log({bouyMarkers}))
  useEffect(() => {
    console.log("use efect");
    getUserLocation({ setUserLocation });
  }, []);
  useEffect(()=>{
    if(!userLocation)return
    let {lat, lng} = userLocation
    get_nearby_bouy_data(   lat,
      lng,
      bouyMarkers,
      setBouyMarkers,
      setUserLocation)
  }, [userLocation])
  console.log({bouyMarkers})

  const map_click = (e) => {
    let { lat, lng } = e.latlng;
    setUserLocation({lat, lng})

  }
  // const get_buoy_data = (e)=> {
  //   let { lat, lng } = e.latlng;
  //   get_nearby_bouy_data(lat, lng,bouyMarkers, setBouyMarkers, setUserLocation);
  // }
  
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
      <Leaf_map
        latLng={userLocation}
        buoy_data={bouyMarkers}
        handleClick={map_click}
      ></Leaf_map>
      <Container>

      {colors_legend()}
      </Container>

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

