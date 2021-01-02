import React, { useEffect, useState } from "react";
// import Link from "next/link";
import Head from "next/head";
import Container from "@material-ui/core/Container";
// import Grid from '@material-ui/core/Grid'
// import { MyMap } from "../components/Maps/RGM.js";
// import  MyMap from "../components/Maps/RGM_API.js";
import LeafMap from "../src/components/Maps/Leaflet_Map.js";
// import lStyles from 'leaflet/dist/leaflet.css'
import { ColorsLegend } from "../src/components/colors/colors";
import BottomNavContext from "../src/Context/BottomNavContext.js";
import PropTypes from "prop-types";
import LoadingScreen from '../src/components/LoadingOverLay.js'
// const LeafMap = dynamic(import("../components/Maps/Leaflet_Map.js"), {
//   ssr: false
// });
// import dynamic from "next/dynamic";

import {
  getUserLocation,
  useBouys,
  useLocation,
  get_nearby_bouy_data,
} from "../src/components/utilFunctions.js";

const Home = () => {
  // const google = window.google;
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useLocation();
  // console.log({ userLocation });
  const [bouyMarkers, setBouyMarkers] = useBouys([{}]);

  // useEffect(() => console.log({ bouyMarkers }));
  useEffect(() => {
    console.log("use efect");
    getUserLocation({ setUserLocation });
  }, []);
  useEffect(() => {
    let mounted = true;
    if (!userLocation) return;
    const { lat, lng } = userLocation;
    setLoading(true);
    get_nearby_bouy_data(lat, lng, bouyMarkers, setBouyMarkers).then(() => {
      if (mounted) setLoading(false);
    });
    return () => (mounted = false);
  }, [userLocation]);
  // console.log({ bouyMarkers });

  const map_click = (e) => {
    const { lat, lng } = e.latlng;
    if (loading) return;
    setUserLocation({ lat, lng });
  };

  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
      <BottomNavContext.Consumer>
        {(props) => {
          console.log(props);
          const { bottomNavSetting } = props;
          return (
            <>
                {loading && <LoadingScreen/>}
              <LeafMap
                // useClick={[clicks, setClicks]}
                bottomNavSetting={bottomNavSetting}
                latLng={userLocation}
                buoy_data={bouyMarkers}
                handleClick={map_click}
              />
              <Container>
                <ColorsLegend bottomNavSetting={bottomNavSetting} />
              </Container>
            </>
          );
        }}
      </BottomNavContext.Consumer>
    </div>
  );
};

Home.propTypes = {
  bottomNavSetting: PropTypes.number,
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
