import WaveMarker from "./WaveMarker.js";
import ReactDOMServer from "react-dom/server";

import L,{ Map, tileLayer, marker, divIcon } from "leaflet";
import  {markerClusterGroup} from 'leaflet.markercluster'
import MyApp from "../../../pages/_app.js";
let map;
export default function createMap({ lat, lng }) {
  map = new Map("map").setView([0, 0], 1);
  var Esri_WorldImagery = tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
  );
  var OpenTopoMap = tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 17,
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }
  );
  const MapBox = tileLayer(
    `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${process.env.MAPBOX_API}`,
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 20,
      id: "mapbox.satellite"
      // accessToken:
    }
  );
  MapBox.addTo(map);

  // tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  // }).addTo(map);
  var popup = L.popup();

  function onMapClick(e) {
    popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(map);
  }

  map.on("click", onMapClick);
  return map;
}

export function create_markers(buoy_data, selection, map) {
  if (Object.keys(buoy_data).length) {
    var markers = L.markerClusterGroup({
        
        maxClusterRadius:0
    });

    console.log(map);
    Object.keys(buoy_data).map(station_id => {
      let currentData = buoy_data[station_id][0];
      /* if wave data selected  //TODO make wind one */
      let myIcon, popUp;
      if (selection === "wave_data") {
        myIcon = return_Wave_Icon(currentData);
        popUp = return_wave_popUp(currentData)
      }
      if (!myIcon) return;
      console.log(currentData);
      markers.addLayer(marker([currentData.LAT, currentData.LON], { icon: myIcon }).bindPopup(popUp))
    });
    map.addLayer(markers)
  }
}

function return_wave_popUp(currentData){
    let ft = (currentData.SwH);
    let sec = (currentData.SwP);  
      let popUp = ReactDOMServer.renderToString(
        <Data_popup text={`${ft} ft. @ ${sec} sec.`}/>
      )
      return popUp
}
function return_Wave_Icon(currentData) {
  let color_ft = colorFt(currentData.SwH);
  let size_period = sizePeriod(currentData.SwP);
  if (isNaN(currentData.SwP) && isNaN(currentData.SwH)) return null;
  var myIcon = L.divIcon({
    className: "swell_marker",
    html: ReactDOMServer.renderToString(
      <WaveMarker
        onClick={console.log()}
        data={currentData}
        color_ft={color_ft}
        size_period={size_period}
      />
    ),
    // iconSize: [30, 42],
    iconAnchor: [15, 42]
  });
  return myIcon;
}
/* could be exported elsewhere */
function sizePeriod(sec) {
  if (sec < 10) return 20;
  else if (sec < 12) return 30;
  else if (sec < 14) return 40;
  else if (sec < 16) return 50;
  else if (sec < 18) return 60;
  else return 80;
}

function colorFt(height) {
  if (height < 1) return "cornflowerblue"; //  
  else if (height < 2) return "dodgerblue";//
  else if (height < 3) return "steelblue";//
  else if (height < 4) return "royalblue";//
  else if (height < 5) return "forestgreen";// 
  else if (height < 6) return "greenyellow";//
  else if (height < 7) return "lightgreen";//
  else if (height < 8) return "darkorange";
  else if (height < 9) return "yellow";
  else if (height < 10) return "orange";// 
  else if (height < 11) return "orangered";
  else if (height < 12) return "red";// 
  else if (height < 13) return "mediumvioletred";
  else if (height < 14) return "palevioletred";
  else return "pink";
}


function Data_popup({text}){
    return (
        <p>
            {text}
        </p>
    )
}