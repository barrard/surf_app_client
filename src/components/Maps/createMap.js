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
  Esri_WorldImagery.addTo(map);

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
        let latest_data = buoy_data[station_id]
      let currentData = buoy_data[station_id][0];
      /* if wave data selected  //TODO make wind one */
      let myIcon, popUp;
      if (selection === "wave_data") {
        myIcon = return_Wave_Icon(currentData);
        popUp = return_wave_popUp(latest_data)
      }
      if (!myIcon) return;
      console.log(currentData);
      markers.addLayer(marker([currentData.LAT, currentData.LON], { icon: myIcon }).bindPopup(popUp))
    });
    map.addLayer(markers)
  }
}

function return_wave_popUp(latest_data){
    let currentData = latest_data[0];


      let popUp = ReactDOMServer.renderToString(
        <Data_popup latest_data={latest_data}/>
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


function Data_popup({ latest_data}){
    /* time stamp data */
    return <>
            <p>Station ID:{latest_data[0].ID}</p>

        <p>{convert_GMT_hours(latest_data[0].TIME).date_string}</p>
        {
            latest_data.map((data)=>(
                
                <p>{`${convert_GMT_hours(data.TIME).time_string} ${data.SwH} ft. @ ${data.SwP} sec. ${data.SwD}`}</p>
            ))
        }
    </>





    
}


function convert_GMT_hours(GMT_hour_timestamp){//0700 should return 900PM hawaii
/* if time is 530, we need it to be 0530 */
    GMT_hour_timestamp = process_GMT_timestamp(GMT_hour_timestamp)
    let hour = GMT_hour_timestamp.slice(0, 2)
    let minute = GMT_hour_timestamp.slice(2, 4)
    let offset = new Date().getTimezoneOffset() /60

    let GMT_date_string = new Date().toGMTString()

    let GMT_day = new Date(GMT_date_string).getUTCDate()
    // let GMT_hour = new Date(GMT_date_string).getUTCHours()
    let GMT_month = new Date(GMT_date_string).getUTCMonth()//0-11
    let GMT_year = new Date(GMT_date_string).getUTCFullYear()
    console.log({
         GMT_day, GMT_month, GMT_year
    })

    let tmp_date = new Date(GMT_year, GMT_month, GMT_day, hour, minute)
    tmp_date= tmp_date.setHours(tmp_date.getHours() - offset)
    // console.log(tmp_date)
    // console.log(new Date(tmp_date))
    //  console.log(tmp_date.toLocaleDateString())
    let date_string = new Date(tmp_date).toDateString()
    let time_string = new Date(tmp_date).toLocaleTimeString()
    return {date_string, time_string}


}
 
function process_GMT_timestamp(time){
    time = String(time)
    if(time.length===3){
        time = time.split('')
        time.unshift('0')
        time = time.join('')
    }


    return time

}