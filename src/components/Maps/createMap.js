import React from 'react'
import { WaveIcon, WindIcon } from './MapIcons.js'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'

import L, { Map, tileLayer, marker } from 'leaflet'
/* eslint-disable */
import markerClusterGroup from "leaflet.markercluster";
/* eslint-enable */

import { colors } from '../colors/colors'
let map
export default function createMap (handleClick) {
  map = new Map('map').setView([0, 0], 1)
  var Esri_WorldImagery = tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      maxZoom: 19,
      attribution:
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }
  )
  // var OpenTopoMap = tileLayer(
  //   'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  //   {
  //     maxZoom: 17,
  //     attribution:
  //       'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  //   }
  // )
  // const MapBox = tileLayer(
  //   `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${process.env.MAPBOX_API}`,
  //   {
  //     attribution:
  //       'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //     maxZoom: 20,
  //     id: 'mapbox.satellite'
  //     // accessToken:
  //   }
  // )
  Esri_WorldImagery.addTo(map)

  // tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  // }).addTo(map);
  // var popup = L.popup();

  map.on('click', handleClick)
  return map
}

let markersRef = null
export function create_markers (buoy_data, selection, map) {
  console.log({ markersRef })
  if (markersRef) map.removeLayer(markersRef)
  markersRef = null
  var markers = L.markerClusterGroup({
    maxClusterRadius: 20
  })

  if (Object.keys(buoy_data).length) {
    // console.log(map);
    Object.keys(buoy_data).map((station_id, index) => {
      const latest_data = buoy_data[station_id]
      const currentData = buoy_data[station_id][0]
      /* if wave data selected  //TODO make wind one */
      let myIcon, popUp
      if (selection === 0) {
        // console.log('MAKEING WAVE ICON')
        myIcon = return_Wave_Icon(currentData)
        popUp = return_wave_popUp(latest_data)
      } else if (selection === 1) {
        // console.log('MAKEING WIND ICON')
        console.log(currentData)
        myIcon = returnWindIcon(currentData)
        popUp = returnWindPopUp(latest_data)
      }
      if (!myIcon) return
      // console.log(currentData);
      const myMarker = marker([currentData.LAT, currentData.LON], {
        icon: myIcon
      }).bindPopup(popUp)
      // mapMarkers = [...mapMarkers, ...[myMarker]]
      markers.addLayer(myMarker)
    })
    markersRef = markers
    map.addLayer(markers)
  }
}

function returnWindPopUp (latest_data) {
  const popUp = ReactDOMServer.renderToString(
    <WindDataPopup latest_data={latest_data} />
  )
  return popUp
}
function returnWindIcon (currentData) {
  if (
    isNaN(currentData.WSPD) &&
    isNaN(currentData.WDIR)
  ) {
    return null
  }
  const color_spd = colorWspd(currentData.WSPD)
  const color_gst = colorWspd(
    currentData.GST !== '-' ? currentData.GST : currentData.WSPD
  )
  const size_gust = sizeGust(currentData.WSPD)
  const direction = parseDirection(parseDegrees(currentData.WDIR))
  var myIcon = L.divIcon({
    className: '',

    html: ReactDOMServer.renderToString(
      <WindIcon
        color_gst={color_gst}
        direction={direction}
        color_spd={color_spd}
        size={size_gust}
        speed={currentData.WSPD}
      />
    ),
    iconAnchor: [0, 0]
  })
  return myIcon
}

function return_wave_popUp (latest_data) {
  const popUp = ReactDOMServer.renderToString(
    <WaveDataPopup latest_data={latest_data} />
  )
  return popUp
}
function return_Wave_Icon (currentData) {
  // console.log(currentData)
  if (
    isNaN(currentData.SwP) &&
    isNaN(currentData.SwH) &&
    (isNaN(currentData.APD) && isNaN(currentData.WVHT))
  ) {
    return null
  }
  const color_ft = colorFt(
    currentData.SwH !== '-' ? currentData.SwH : currentData.WVHT
  )
  const size_period = sizePeriod(
    currentData.SwP !== '-' ? currentData.SwP : currentData.APD
  )
  const direction =
    currentData.SwD !== '-' ? currentData.SwD : parseDegrees(currentData.WDIR)
  var myIcon = L.divIcon({
    className: '',
    html: ReactDOMServer.renderToString(
      <WaveIcon SwD={direction} color_ft={color_ft} size_period={size_period} />
    ),
    iconAnchor: [0, 0]
  })
  return myIcon
}
function colorWspd (spd) {
  let color
  if (spd > 0 && spd < 6) color = colors[0]
  else if (spd > 0 && spd < 3) color = colors[0]
  else if (spd > 2 && spd < 6) color = colors[1]
  else if (spd > 5 && spd < 8) color = colors[2]
  else if (spd > 7 && spd < 10) color = colors[3]
  else if (spd > 9 && spd < 12) color = colors[4]
  else if (spd > 11 && spd < 14) color = colors[5]
  else if (spd > 13 && spd < 16) color = colors[6]
  else if (spd > 15 && spd < 18) color = colors[7]
  else if (spd > 17 && spd < 20) color = colors[8]
  else if (spd > 19 && spd < 22) color = colors[9]
  else if (spd > 21 && spd < 24) color = colors[10]
  else if (spd > 23 && spd < 26) color = colors[11]
  else if (spd > 25 && spd < 28) color = colors[12]
  else if (spd > 27 && spd < 30) color = colors[13]
  else if (spd > 29) color = colors[14]
  console.log({ color })
  return color
}
function sizeGust (spd) {
  let size = 25
  size = size + spd
  return size
}

function parseDirection (compassDirr) {
  const c = compassDirr
  if (c === 'W') return 'left'
  else if (c === 'SW') return 'up-left'
  else if (c === 'S') return 'up'
  else if (c === 'SE') return 'up-right'
  else if (c === 'E') return 'right'
  else if (c === 'NE') return 'down-left'
  else if (c === 'N') return 'down'
  else if (c === 'NW') return 'down-right'
}
function parseDegrees (degrees) {
  let direction
  if (degrees > 0 && degrees < 46) direction = 'SW'
  else if (degrees > 45 && degrees < 91) direction = 'W'
  else if (degrees > 90 && degrees < 136) direction = 'NW'
  else if (degrees > 135 && degrees < 181) direction = 'N'
  else if (degrees > 180 && degrees < 226) direction = 'NE'
  else if (degrees > 225 && degrees < 271) direction = 'E'
  else if (degrees > 270 && degrees < 316) direction = 'SE'
  else if (degrees > 315) direction = 'S'
  else direction = 'N'
  // console.log({ direction, degrees })
  return direction
}
/* could be exported elsewhere */
function sizePeriod (sec) {
  if (isNaN(sec)) return 20
  if (sec < 10) return 20
  else if (sec < 12) return 30
  else if (sec < 14) return 40
  else if (sec < 16) return 50
  else if (sec < 18) return 60
  else return 80
}

function colorFt (height) {
  const length = colors.length
  const ft = Math.floor(height)
  // console.log({ ft, length, height })
  const getColor = ft => {
    if (ft >= length) return colors[length - 1]
    else return colors[ft]
  }

  const color = getColor(ft)
  // console.log({ color })
  return color
}

function WindDataPopup ({ latest_data }) {
  /* time stamp data */
  return (
    <>
      <p>
        Station ID:
        <a
          href={`https://www.ndbc.noaa.gov/station_page.php?station=${latest_data[0].ID}`}
        >
          {latest_data[0].ID}
        </a>
      </p>

      <p>{convert_GMT_hours(latest_data[0].TIME).date_string}</p>
      {latest_data.map((data, key) => (
        <p key={key}>
          {`${convert_GMT_hours(data.TIME).time_string} ${
            data.WSPD
          } kts. Gust @ ${data.GST} | ${parseDegrees(data.WDIR)}`}
        </p>
      ))}
    </>
  )
}
WindDataPopup.propTypes = {
  latest_data: PropTypes.arrayOf(
    PropTypes.shape({
      TIME: PropTypes.number.isRequired,
      ID: PropTypes.node.isRequired
    }).isRequired
  ).isRequired
}
function WaveDataPopup ({ latest_data }) {
  /* time stamp data */
  return (
    <>
      <p>
        Station ID:
        <a
          href={`https://www.ndbc.noaa.gov/station_page.php?station=${latest_data[0].ID}`}
        >
          {latest_data[0].ID}
        </a>
      </p>

      <p>{convert_GMT_hours(latest_data[0].TIME).date_string}</p>
      {latest_data.map((data, key) => (
        <p key={key}>
          {`${convert_GMT_hours(data.TIME).time_string} ${
            data.SwH !== '-' ? data.SwH : data.WVHT
          } ft. @ ${data.SwP !== '-' ? data.SwP : data.APD} sec. ${
            data.SwD !== '-' ? data.SwD : parseDegrees(data.WDIR)
          }`}
        </p>
      ))}
    </>
  )
}
WaveDataPopup.propTypes = {
  latest_data: PropTypes.arrayOf(
    PropTypes.shape({
      TIME: PropTypes.number.isRequired,
      ID: PropTypes.node.isRequired
    }).isRequired
  ).isRequired
}

export function add_circle ([lat, lng], map) {
  L.circle([lat, lng], {
    radius: 250 * 1610,
    fillOpacity: 0.0,
    interactive: false
  }).addTo(map)
}

function convert_GMT_hours (GMT_hour_timestamp) {
  // 0700 should return 900PM hawaii
  /* if time is 530, we need it to be 0530 */
  GMT_hour_timestamp = process_GMT_timestamp(GMT_hour_timestamp)
  const hour = GMT_hour_timestamp.slice(0, 2)
  const minute = GMT_hour_timestamp.slice(2, 4)
  const offset = new Date().getTimezoneOffset() / 60

  const GMT_date_string = new Date().toGMTString()

  let tmp_date = new Date(GMT_date_string).setHours(hour - offset)
  tmp_date = new Date(tmp_date).setMinutes(minute)

  const date_string = new Date(tmp_date).toDateString()
  const time_string = new Date(tmp_date).toLocaleTimeString()
  return { date_string, time_string }
}

function process_GMT_timestamp (time) {
  time = String(time)
  if (time.length === 3) {
    time = time.split('')
    time.unshift('0')
    time = time.join('')
  }

  return time
}
