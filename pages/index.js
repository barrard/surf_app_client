import React, { Component, useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { MyMap } from "../components/Maps/RGM.js";
import { getUserLocation, useMarkers,
  useLocation } from "../components/utilFunctions.js";

const Home = () => {
  let [mapCenter, setMapCenter] = useLocation({
    lat: 44.8338944, lng: -122.8435008
  });
  let [mapMarkers, setMapMarkers] = useMarkers([
    { lat: 44.8338944, lng: -122.8435008 }
  ]);
  useEffect( () => {
    getUserLocation({setMapCenter,
      setMapMarkers, mapMarkers});

  }, []);
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>

      <MyMap markers={mapMarkers} center={mapCenter} />

      {/* left for example */}
      <style jsx>{`
      {/* .hero {
        width: 100%;
        color: #333;
      } */}

      }
    `}</style>
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
