import React, {useEffect, useRef} from 'react'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "@react-google-maps/api";
import { MarkerWithLabel } from "@react-google-maps/api/lib/components/addons/MarkerWithLabel";
import WaveMarker from "./WaveMarker.js";

export function MyMap(props) {
  let map_ref = useRef()
  let { markers, center, handleLabelClick, handleClick } = props;
  console.log({ markers, center });
  useEffect(()=>{
  }, [])
  const MapWithAMarker = withScriptjs(
    withGoogleMap(props => {
      console.log({props})
      console.log({google})
      console.log(google.maps.Map)
      return(
        <GoogleMap
        ref={map => {
          console.log(map)
          // google.maps.event.addListener(map, 'bounds_changed', ()=>console.log('OOOOOOOOOOOMGGGGGGGGGGMMMMMMMM'))
            // console.log(map_ref)
            map_ref = map 
          }}
          defaultZoom={8}
          defaultCenter={center}
          onClick={handleClick}
        >
          {Object.keys(markers).map(marker => {
            console.log(google)
            let currentData = markers[marker][0];
            // console.log(currentData)
            let color_ft = colorFt(currentData.SwH);
            let size_period = sizePeriod(currentData.SwP);
            if (!isNaN(currentData.SwP) && !isNaN(currentData.SwH)) {
              return (
                <MarkerWithLabel
                  key={marker}
                  icon={"none"}
                  position={{ lat: currentData.LAT, lng: currentData.LON }}
                  labelClass={"swell_marker"}
                  labelAnchor={
                    new google.maps.Point(size_period / 2, size_period / 2)
                  }
                  labelStyle={{}}
                  onClick={() => handleLabelClick(currentData)}
                >
                  <WaveMarker
                    data={currentData}
                    color_ft={color_ft}
                    size_period={size_period}
                  />
                </MarkerWithLabel>
              );
            } else {
              <></>;
            }
          })}
        </GoogleMap>
      )
    })
  );

  console.log(process.env.GOOGLE);

  return (
    <MapWithAMarker
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE}&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `400px` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  );
}

/* could be exported elsewhere */
function sizePeriod(sec) {
  if (sec < 10) return "20";
  else if (sec < 12) return 30;
  else if (sec < 14) return 40;
  else if (sec < 16) return 50;
  else if (sec < 18) return 60;
  else return "80";
}

function colorFt(height) {
  if (height < 1) return "blue";
  else if (height < 2) return "green";
  else if (height < 3) return "yellow";
  else if (height < 3) return "orange";
  else if (height < 4) return "red";
  else return "pink";
}
