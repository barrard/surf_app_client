import React from 'react'
import { WaveIcon, WindIcon } from './MapIcons.js'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import L, { Map, tileLayer, marker } from 'leaflet'
/* eslint-disable */
import markerClusterGroup from "leaflet.markercluster";

/* eslint-enable */

import { colors } from '../colors/colors'
let map
const clickRaduis = 250
const metersPerNm = 1610
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
  // console.log({ markersRef })
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
        // console.log(currentData)
        myIcon = returnWindIcon(currentData)
        popUp = returnWindPopUp(latest_data)
      }
      if (!myIcon) return
      // console.log(currentData);
      const myMarker = marker([currentData.LAT, currentData.LON], {
        icon: myIcon
      })
        .bindPopup(popUp, {
          maxWidth: 300,
          minWidth: 300,
          maxHeight: 200,
          className: 'leaflet-popup'
        })
        .on('popupopen', function (popup) {
          setTimeout(() => {
            const windChart = document.getElementById('windChartContainer')

            if (windChart) make_wind_chart('windChartContainer', latest_data)
            const waveChart = document.getElementById('waveChartContainer')

            if (waveChart) make_wave_chart('waveChartContainer', latest_data)
          }, 200)
        })
      // mapMarkers = [...mapMarkers, ...[myMarker]]
      markers.addLayer(myMarker)
    })
    markersRef = markers
    map.addLayer(markers)
  }
}

function returnWindPopUp (latest_data) {
  const popUp = ReactDOMServer.renderToString(
    <>
      <div id='windChartContainer' />
      <WindDataPopup latest_data={latest_data} />
    </>
  )
  return popUp
}
function returnWindIcon (currentData) {
  if (isNaN(currentData.WSPD) && isNaN(currentData.WDIR)) {
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
    <>
      <div id='waveChartContainer' />

      <WaveDataPopup latest_data={latest_data} />
    </>
  )
  return popUp
}
function return_Wave_Icon (currentData) {
  let period, waveDirection, height
  if (currentData.SwP !== '-') period = currentData.SwP
  else if (currentData.APD !== '-') period = currentData.APD

  if (currentData.SwD !== '-') waveDirection = currentData.SwD
  else if (currentData.WDIR !== '-') waveDirection = currentData.WDIR

  if (currentData.SwH !== '-') height = currentData.SwH
  else if (currentData.WVHT !== '-') height = parseDegrees(currentData.WDIR)

  if (
    !period || !waveDirection || !height
  ) {
    return null
  }
  // console.log(currentData)
  const color_ft = colorFt(height)
  const size_period = sizePeriod(period)
  const direction = waveDirection
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
  // console.log({ color })
  return color
}
function sizeGust (spd) {
  let size = 25
  size = size + spd
  return size
}

function parseDirection (compassDirr) {
  const c = compassDirr
  if (c === 'W') return 'right'
  else if (c === 'SW') return 'up-right'
  else if (c === 'S') return 'up'
  else if (c === 'SE') return 'up-left'
  else if (c === 'E') return 'left'
  else if (c === 'NE') return 'down-left'
  else if (c === 'N') return 'down'
  else if (c === 'NW') return 'down-right'
}
function parseDegrees (degrees) {
  let direction
  if (degrees > 337 || degrees < 23) direction = 'N'
  else if (degrees > 22 && degrees < 68) direction = 'NE'
  else if (degrees > 67 && degrees < 113) direction = 'E'
  else if (degrees > 112 && degrees < 158) direction = 'SE'
  else if (degrees > 157 && degrees < 203) direction = 'S'
  else if (degrees > 202 && degrees < 248) direction = 'SW'
  else if (degrees > 247 && degrees < 293) direction = 'W'
  else if (degrees > 292 && degrees < 338) direction = 'NW'
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
  console.log({ latest_data })
  /* time stamp data */
  return (
    <div>
      <StationIdLink latest_data={latest_data} />

      {latest_data.map((data, key) => (
        <p key={key}>
          {`${convert_GMT_hours(data.TIME).time_string} ${
            data.WSPD
          } kts. Gust @ ${data.GST} | ${parseDegrees(data.WDIR)}`}
        </p>
      ))}
    </div>
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
  if (latest_data[0].ID === 51213) {
    console.log({ latest_data })
  }
  return (
    <>
      <StationIdLink latest_data={latest_data} />

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

const cicleRadius = clickRaduis * metersPerNm
export function add_circle ([lat, lng], map) {
  L.circle([lat, lng], {
    radius: cicleRadius,
    fillOpacity: 0.0,
    interactive: false
  }).addTo(map)
}

function convert_GMT_hours (GMT_hour_timestamp) {
  // console.log({ GMT_hour_timestamp })
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
  // console.log({ date_string, time_string })
  return { date_string, time_string }
}

function process_GMT_timestamp (time) {
  time = String(time)
  if (time.length < 4) {
    time = time.split('')
    time.unshift('0')
    time = time.join('')
  }
  if (time.length < 4) {
    return process_GMT_timestamp(time)
  } else {
    return time
  }
}
function StationIdLink ({ latest_data }) {
  const id = latest_data[0].ID
  return (
    <Container>
      <Grid container space={0}>
        <Grid item xs={6}>
          <p>
            Station ID:{' '}
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={`https://www.ndbc.noaa.gov/station_page.php?station=${id}`}
            >
              {id}
            </a>
          </p>
        </Grid>
        <Grid item xs={6}>
          <p>{new Date().toDateString()}</p>
        </Grid>
      </Grid>
    </Container>
  )
}
StationIdLink.propTypes = {
  latest_data: PropTypes.object
}

function make_wave_chart (divId, data) {
  /* take in the data and adjust the TIME */
  console.log(data)

  data = makeWaveData(data)
  console.log(data)
  const svg = dimple.newSvg(`#${divId}`, 275, 150)
  // data = dimple.filterData(data, "Owner", ["Aperture", "Black Mesa"])
  const myChart = new dimple.chart(svg)
  const periodData = data.filter(d => d.Seconds !== undefined)
  const heightData = data.filter(d => d.Ft !== undefined)

  myChart.setBounds(60, 30, 275, 150)
  // setMargins(left, top, right, bottom)
  myChart.setMargins(45, 30, 50, 40)

  const x = myChart.addTimeAxis('x', 'time')
  // x.dateParseFormat = '%H:%M:%S'
  // x.ticks = 4
  x.timePeriod = d3.timeMinute
  x.timeInterval = 20

  x.tickFormat = '%I:%M'
  // x.addOrderRule('time')
  const y1 = myChart.addMeasureAxis('y', 'Seconds')
  const y2 = myChart.addMeasureAxis('y', 'Ft')
  y1.ticks = 4
  y2.ticks = 4
  y1.title = 'Sec.'
  y2.title = 'Ft.'
  // myChart.addColorAxis('Wind Speed', ['blue', 'yellow'])
  // Min price will be green, middle price yellow and max red
  // myChart.addColorAxis('GST', ['green', 'red'])
  const sec_min = getMin(data, 'Seconds')
  const sec_max = getMax(data, 'Seconds')
  const ft_min = getMin(data, 'Ft')
  const ft_max = getMax(data, 'Ft')
  // console.log({ sec_max, sec_min, ft_max, ft_min })
  y1.overrideMax = sec_max + sec_max * 0.1
  y1.overrideMin = sec_min - sec_min * 0.1
  y2.overrideMax = ft_max + ft_max * 0.1
  y2.overrideMin = ft_min - ft_min * 0.1

  myChart.assignColor('Ft', 'green')
  const s1 = myChart.addSeries('type', dimple.plot.line, [x, y1])
  const s2 = myChart.addSeries('type', dimple.plot.line, [x, y2])
  s1.data = periodData
  s2.data = heightData
  s1.lineMarkers = true

  s1.interpolation = 'cardinal'
  s2.lineMarkers = true

  s2.interpolation = 'cardinal'
  myChart.addLegend(100, 0, 50, 200, 'right')

  myChart.draw()
}

function make_wind_chart (divId, data) {
  /* take in the data and adjust the TIME */
  // console.log(data)

  data = makeWindData(data)
  // console.log(data)
  const svg = dimple.newSvg(`#${divId}`, 275, 150)
  // data = dimple.filterData(data, "Owner", ["Aperture", "Black Mesa"])
  const myChart = new dimple.chart(svg, data)
  myChart.setBounds(60, 30, 275, 150)
  // setMargins(left, top, right, bottom)
  myChart.setMargins(45, 30, 0, 40)

  const x = myChart.addTimeAxis('x', 'time')
  // x.dateParseFormat = '%H:%M:%S'
  // x.ticks = 4
  x.timePeriod = d3.timeMinute
  x.timeInterval = 20

  x.tickFormat = '%I:%M'
  // x.addOrderRule('time')
  const y1 = myChart.addMeasureAxis('y', 'kts')
  // const y2 = myChart.addMeasureAxis('y', 'Gust')
  y1.ticks = 4
  // myChart.addColorAxis('Wind Speed', ['blue', 'yellow'])
  // Min price will be green, middle price yellow and max red
  // myChart.addColorAxis('GST', ['green', 'red'])
  const prop_min = getMin(data, 'kts')
  const prop_max = getMax(data, 'kts')
  y1.overrideMax = prop_max + prop_max * 0.1
  y1.overrideMin = prop_min - prop_min * 0.1

  myChart.assignColor('Wind Speed', 'green')
  const s1 = myChart.addSeries('type', dimple.plot.line)
  // const s2 = myChart.addSeries(null, dimple.plot.line, [x, y2])
  s1.lineMarkers = true

  s1.interpolation = 'cardinal'
  // s2.lineMarkers = true

  // s2.interpolation = 'cardinal'
  myChart.addLegend(100, 0, 50, 200, 'right')

  myChart.draw()
}
function getMin (data, prop) {
  // console.log({ data, prop })
  const _data = data.filter(d => d[prop] !== undefined)
  // console.log({ _data, prop })
  return parseFloat(
    _data.reduce((min, p) => (p[prop] < min ? p[prop] : min), _data[0][prop])
  )
}
function getMax (data, prop) {
  const _data = data.filter(d => d[prop] !== undefined)
  // console.log({ _data, prop })

  // console.log(_data)

  return parseFloat(
    _data.reduce((max, p) => (p[prop] > max ? p[prop] : max), _data[0][prop])
  )
}

function makeWaveData (data) {
  const new_data = []
  data.forEach(d => {
    const period = {
      type: 'Period',
      time: adjustTime(d.TIME),
      Seconds: d.SwP
    }
    const height = {
      type: 'Wave Height',
      time: adjustTime(d.TIME),
      Ft: d.SwH
    }
    new_data.push(period)
    new_data.push(height)
  })
  return new_data
}
function makeWindData (data) {
  const new_data = []
  data.forEach(d => {
    const gust = {
      type: 'Gust',
      time: adjustTime(d.TIME),
      kts: d.GST
    }
    const wspd = {
      type: 'Wind Speed',
      time: adjustTime(d.TIME),
      kts: d.WSPD
    }
    new_data.push(gust)
    new_data.push(wspd)
  })
  return new_data
}
function fixTimeAndRelabel (data, alterLables) {
  data = data.map(d => {
    const relabled_data = {}
    for (const newLabel in alterLables) {
      relabled_data[newLabel] = d[alterLables[newLabel]]
    }
    return { ...d, TIME: adjustTime(d.TIME), ...relabled_data }
  })
  return data
}

function adjustTime (time) {
  // 130

  time = process_GMT_timestamp(time)
  // 0130
  const offset = new Date().getTimezoneOffset() / 60
  let hour = time.slice(0, 2)
  const minute = time.slice(2, 4)

  hour = hour - offset
  if (hour < 0) hour = hour + 24
  // console.log(`${hour}:${minute}`)
  time = new Date().setHours(hour, minute)
  return new Date(time).getTime()
}
