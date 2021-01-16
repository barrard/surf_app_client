import React from "react";
import { WaveIcon, WindIcon, TempIcon } from "./MapIcons.js";
import ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import L, { Map, tileLayer, marker } from "leaflet";
/* eslint-disable */
import markerClusterGroup from "leaflet.markercluster";

/* eslint-enable */

import { colors } from "../colors/colors";
import { parseDegrees } from "../utilFunctions";
let map;
const clickRaduis = 450;
const metersPerNm = 1610;
const d3 = window.d3;
const dimple = window.dimple;
export default function createMap(handleClick) {
  map = new Map("map").setView([0, 0], 1);
  var Esri_WorldImagery = tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  );
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
  Esri_WorldImagery.addTo(map);

  // tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  // }).addTo(map);
  // var popup = L.popup();

  map.on("click", handleClick);
  return map;
}

let markersRef = null;
export function create_markers(buoy_data, selection, map) {
  // console.log({ markersRef })
  if (markersRef) map.removeLayer(markersRef);
  markersRef = null;
  var markers = L.markerClusterGroup({
    maxClusterRadius: 0,
  });

  if (Object.keys(buoy_data).length) {
    // console.log(map);
    Object.keys(buoy_data).map((station_id, index) => {
      const latest_data = buoy_data[station_id];
      latest_data.forEach((d) =>
        Object.keys(d).forEach((prop) => {
          if (d[prop] === "-") d[prop] = false;
        })
      );

      //this needs to look back a few sometimes
      const currentData = getCurrentData(buoy_data[station_id]);
      /* if wave data selected  //TODO make wind one */

      let myIcon, popUp;
      if (selection === 0) {
        // console.log('MAKEING WAVE ICON')
        myIcon = return_Wave_Icon(currentData);
        popUp = return_wave_popUp(latest_data);
      } else if (selection === 1) {
        // console.log('MAKEING WIND ICON')
        myIcon = returnWindIcon(currentData);
        popUp = returnWindPopUp(latest_data);
      } else if (selection === 2) {
        myIcon = returnTempIcon(currentData);
        popUp = returnTempPopUp(latest_data);
      }
      if (!myIcon) return;
      // console.log(currentData);
      const myMarker = marker([currentData.LAT, currentData.LON], {
        icon: myIcon,
      })
        .bindPopup(popUp, {
          maxWidth: 300,
          minWidth: 300,
          maxHeight: 200,
          className: "leaflet-popup",
        })
        .on("popupopen", function (popup) {
          setTimeout(() => {
            const windChart = document.getElementById("windChartContainer");

            if (windChart) make_wind_chart("windChartContainer", latest_data);
            const waveChart = document.getElementById("waveChartContainer");

            if (waveChart) make_wave_chart("waveChartContainer", latest_data);
            const tempChart = document.getElementById("tempChartContainer");

            if (tempChart)
              make_temperature_chart("tempChartContainer", latest_data);
          }, 200);
        });
      // mapMarkers = [...mapMarkers, ...[myMarker]]
      markers.addLayer(myMarker);
    });
    markersRef = markers;
    map.addLayer(markers);
  }
}

function getCurrentData(data, arrayOfProps) {
  let mostCurrentData = {};
  data = data.slice(0, 20);
  data.forEach((row) => {
    for (let prop in row) {
      if (row[prop] && !mostCurrentData[prop]) {
        mostCurrentData[prop] = row[prop];
      }
    }
  });

  return mostCurrentData;
}

function returnWindPopUp(latest_data) {
  const popUp = ReactDOMServer.renderToString(
    <>
      <div id="windChartContainer" />
      <WindDataPopup latest_data={latest_data} />
    </>
  );
  return popUp;
}

function returnTempPopUp(latest_data) {
  const popUp = ReactDOMServer.renderToString(
    <>
      <div id="tempChartContainer" />
      <TempDataPopup latest_data={latest_data} />
    </>
  );
  return popUp;
}

function returnTempIcon(currentData) {
  // console.log({ currentData })
  if (isNaN(currentData.WTMP) && isNaN(currentData.ATMP)) {
    return null;
  }
  const airTemp = currentData.ATMP;
  const waterTemp = currentData.WTMP;
  const airTempColor = colorTemp(airTemp);
  const waterTempColor = colorTemp(waterTemp);
  var myIcon = L.divIcon({
    className: "",

    html: ReactDOMServer.renderToString(
      <TempIcon
        airTempColor={airTempColor}
        waterTempColor={waterTempColor}
        airTemp={airTemp}
        waterTemp={waterTemp}
      />
    ),
    iconAnchor: [0, 0],
  });
  return myIcon;
}

function returnWindIcon(currentData) {
  // console.log({ currentData })
  if (isNaN(currentData.WSPD) && isNaN(currentData.WDIR)) {
    return null;
  }
  const color_spd = colorWspd(currentData.WSPD);
  const color_gst = colorWspd(
    currentData.GST ? currentData.GST : currentData.WSPD
  );
  const size_gust = sizeGust(currentData.WSPD);
  const direction = parseDirection(parseDegrees(currentData.WDIR));
  var myIcon = L.divIcon({
    className: "",

    html: ReactDOMServer.renderToString(
      <WindIcon
        color_gst={color_gst}
        direction={direction}
        color_spd={color_spd}
        size={size_gust}
        speed={currentData.WSPD}
      />
    ),
    iconAnchor: [0, 0],
  });
  return myIcon;
}

function return_wave_popUp(latest_data) {
  // console.log({latest_data})
  const popUp = ReactDOMServer.renderToString(
    <>
      <div id="waveChartContainer" />

      <WaveDataPopup latest_data={latest_data} />
    </>
  );
  return popUp;
}
function return_Wave_Icon(currentData) {
  let period, waveDirection, height;
  if (currentData.SwP) period = currentData.SwP;
  else if (currentData.DPD) period = currentData.DPD;

  debugger
  if (currentData.SwD) waveDirection = currentData.SwD;
  else if (currentData.MWD) waveDirection = parseDegrees(currentData.MWD);
  else if (currentData.WDIR) waveDirection = parseDegrees(currentData.WDIR);

  if (currentData.SwH) height = currentData.SwH;
  else if (currentData.WVHT) height = currentData.WVHT;

  if (!period || !waveDirection || !height) {
    return null;
  }
  // console.log(currentData)
  const color_ft = colorFt(height);
  const size_period = sizePeriod(period);
  const direction = waveDirection;
  var myIcon = L.divIcon({
    className: "",
    html: ReactDOMServer.renderToString(
      <WaveIcon SwD={direction} color_ft={color_ft} size_period={size_period} />
    ),
    iconAnchor: [0, 0],
  });
  return myIcon;
}
function colorWspd(spd) {
  if (isNaN(spd)) spd = 0;
  let color;
  if (spd > 0 && spd < 6) color = colors[0];
  else if (spd > 0 && spd < 3) color = colors[0];
  else if (spd > 2 && spd < 6) color = colors[1];
  else if (spd > 5 && spd < 8) color = colors[2];
  else if (spd > 7 && spd < 10) color = colors[3];
  else if (spd > 9 && spd < 12) color = colors[4];
  else if (spd > 11 && spd < 14) color = colors[5];
  else if (spd > 13 && spd < 16) color = colors[6];
  else if (spd > 15 && spd < 18) color = colors[7];
  else if (spd > 17 && spd < 20) color = colors[8];
  else if (spd > 19 && spd < 22) color = colors[9];
  else if (spd > 21 && spd < 24) color = colors[10];
  else if (spd > 23 && spd < 26) color = colors[11];
  else if (spd > 25 && spd < 28) color = colors[12];
  else if (spd > 27 && spd < 30) color = colors[13];
  else if (spd > 29) color = colors[14];
  // console.log({ color })
  return color;
}

function colorTemp(temp) {
  if (isNaN(temp)) temp = 0;

  //temp is between 0 50  colors 0-14
  let color = mapNums(temp, 20, 120, 0, 14);
  color = Math.floor(color);
  return colors[color];
}
function sizeGust(spd) {
  let size = 25;
  if (isNaN(spd)) {
    return size;
  } else {
    size = size + spd;
    return size;
  }
}

function cardnalToDegrees(cardnalDir) {
  // console.log(cardnalDir)
  /* for an arrow pointing left how many degrees do27 we need to rotate */
  if (cardnalDir === "N") return 270;
  else if (cardnalDir === "NNW") return 248;
  else if (cardnalDir === "NW") return 225;
  else if (cardnalDir === "WNW") return 202;
  else if (cardnalDir === "W") return 180;
  else if (cardnalDir === "WSW") return 157;
  else if (cardnalDir === "SW") return 135;
  else if (cardnalDir === "SSW") return 112;
  else if (cardnalDir === "S") return 90;
  else if (cardnalDir === "SSE") return 67;
  else if (cardnalDir === "SE") return 45;
  else if (cardnalDir === "ESE") return 23;
  else if (cardnalDir === "E") return 1;
  else if (cardnalDir === "ENE") return 293;
  else if (cardnalDir === "NE") return 315;
  else if (cardnalDir === "NNE") return 338;
  else return 0;
}

function parseDirection(compassDir) {
  const c = compassDir;
  if (c === "W") return "right";
  else if (c === "SW") return "up-right";
  else if (c === "S") return "up";
  else if (c === "SE") return "up-left";
  else if (c === "E") return "left";
  else if (c === "NE") return "down-left";
  else if (c === "N") return "down";
  else if (c === "NW") return "down-right";
}

/* could be exported elsewhere */
function sizePeriod(sec) {
  if (isNaN(sec)) return 20;
  if (sec < 10) return 20;
  else if (sec < 12) return 30;
  else if (sec < 14) return 40;
  else if (sec < 16) return 50;
  else if (sec < 18) return 60;
  else return 80;
}

function colorFt(height) {
  const length = colors.length;
  const ft = Math.floor(height);
  // console.log({ ft, length, height })
  const getColor = (ft) => {
    if (ft >= length) return colors[length - 1];
    else return colors[ft];
  };

  const color = getColor(ft);
  // console.log({ color })
  return color;
}

function WindDataPopup({ latest_data }) {
  console.log("making wind popup");
  // console.log({ latest_data })
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
  );
}
WindDataPopup.propTypes = {
  latest_data: PropTypes.arrayOf(
    PropTypes.shape({
      TIME: PropTypes.number.isRequired,
      ID: PropTypes.node.isRequired,
    }).isRequired
  ).isRequired,
};

function TempDataPopup({ latest_data }) {
  return (
    <div>
      <StationIdLink latest_data={latest_data} />

      {latest_data.map((data, key) => {
        let waterTemp = `| Water Temp. ${data.WTMP}`;
        let airTemp = `Air Temp. ${data.ATMP}`;
        return (
          <p key={key}>
            {`${convert_GMT_hours(data.TIME).time_string} ${
              data.ATMP ? airTemp : ""
            } ${data.WTMP ? waterTemp : ""} `}
          </p>
        );
      })}
    </div>
  );
}
WindDataPopup.propTypes = {
  latest_data: PropTypes.arrayOf(
    PropTypes.shape({
      TIME: PropTypes.number.isRequired,
      ID: PropTypes.node.isRequired,
    }).isRequired
  ).isRequired,
};

function WaveDataPopup({ latest_data }) {
  console.log("making wave popup");
  // console.log({latest_data})
  /* time stamp data */
  return (
    <>
      <StationIdLink latest_data={latest_data} />

      {latest_data.map((data, key) => (
        <p key={key}>
          {`${convert_GMT_hours(data.TIME).time_string} ${
            data.SwH ? data.SwH : data.WVHT
          } ft. @ ${data.SwP ? data.SwP : data.DPD} sec. ${
            data.SwD ? data.SwD : parseDegrees(data.WDIR)
          }`}
        </p>
      ))}
    </>
  );
}
WaveDataPopup.propTypes = {
  latest_data: PropTypes.arrayOf(
    PropTypes.shape({
      TIME: PropTypes.number.isRequired,
      ID: PropTypes.node.isRequired,
    }).isRequired
  ).isRequired,
};

const cicleRadius = clickRaduis * metersPerNm;
export function add_circle([lat, lng], map) {
  L.circle([lat, lng], {
    radius: cicleRadius,
    fillOpacity: 0.0,
    interactive: false,
  }).addTo(map);
}

function StationIdLink({ latest_data }) {
  const id = latest_data[0].ID;
  return (
    <Container>
      <Grid container space={0}>
        <Grid item xs={6}>
          <p>
            Station ID:{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
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
  );
}
StationIdLink.propTypes = {
  latest_data: PropTypes.object,
};

function make_wave_chart(divId, rawData) {
  console.log("Making wave chart");
  /* take in the data and adjust the TIME */

  const data = makeWaveData(rawData);
  // console.log(rawData)
  const w = 275;
  const h = 150;
  const svg = dimple.newSvg(`#${divId}`, w, h); // data = dimple.filterData(data, "Owner", ["Aperture", "Black Mesa"])
  const myChart = new dimple.chart(svg);
  const periodData = data.filter((d) => d.Seconds !== undefined);
  const heightData = data.filter((d) => d.Ft !== undefined);

  const ml = 40;
  const mt = 10;
  const mr = 50;
  const mb = 25;
  // setMargins(left, top, right, bottom)
  myChart.setMargins(ml, mt, mr, mb);

  const x = myChart.addTimeAxis("x", "time");
  // x.dateParseFormat = '%H:%M:%S'
  // x.ticks = 4
  x.timePeriod = d3.timeHour;
  x.timeInterval = 4;

  x.tickFormat = "%I:%M";
  // x.addOrderRule('time')
  const y2 = myChart.addMeasureAxis("y", "Seconds");
  const y1 = myChart.addMeasureAxis("y", "Ft");
  y1.ticks = 4;
  y2.ticks = 4;
  y2.title = "Sec.";
  y1.title = "Ft.";
  // myChart.addColorAxis('Wind Speed', ['blue', 'yellow'])
  // Min price will be green, middle price yellow and max red
  // myChart.addColorAxis('GST', ['green', 'red'])
  if (!data || !data.length) {
  }
  const sec_min = getMin(data, "Seconds");
  const sec_max = getMax(data, "Seconds");
  const ft_min = getMin(data, "Ft");
  const ft_max = getMax(data, "Ft");
  // console.log({ sec_max, sec_min, ft_max, ft_min })
  y2.overrideMax = sec_max + sec_max * 0.2;
  y2.overrideMin = sec_min - sec_min * 0.2;
  y1.overrideMax = ft_max + ft_max * 0.2;
  y1.overrideMin = ft_min - ft_min * 0.2;

  myChart.assignColor("Ft", "green");
  const s1 = myChart.addSeries("type", dimple.plot.line, [x, y2]);
  const s2 = myChart.addSeries("type", dimple.plot.line, [x, y1]);
  s1.data = periodData;
  s2.data = heightData;

  myChart.addLegend(100, 0, 50, 200, "right");

  myChart.draw();
  const swellArrows = d3
    .select(".dimple-series-group-0")
    .append("g")
    .selectAll("path")
    .data(rawData);
  swellArrows.exit().remove();
  swellArrows
    .enter()
    .append("path")
    .merge(swellArrows)
    .attr("class", "dirArrow")
    .attr("transform", waveDir)
    .attr("d", drawArrow);

  function waveDir(d, i) {
    const startX = i * ((w - ml - mr) / rawData.length) + ml - 5;
    const deg = cardnalToDegrees(d.SwD);
    return `rotate(${deg}, ${startX + 5}, ${100})`;
  }
  function drawArrow(d, i) {
    const startX = i * ((w - ml - mr) / rawData.length) + ml - 5;
    return `M ${startX}, 100
                l 5, -3.75
                l 0, 2.5
                l 7.5, 0
                l 0, 2.5
                l -7.5, 0
                l 0, 2.5 z`;
  }
  const tooManyTicks = document.querySelectorAll(".dirArrow");
  const markerCount = 10;
  Array.from(tooManyTicks).map((d, i, a) =>
    i % Math.floor(a.length / markerCount) === 0 ? true : d.remove()
  );
}

function make_temperature_chart(divId, rawData) {
  console.log("Making temperature chart");
  /* take in the data and adjust the TIME */

  const data = makeTempData(rawData);
  if (!data.length) {
    return;
  }
  const w = 275;
  const h = 150;
  const svg = dimple.newSvg(`#${divId}`, w, h); // data = dimple.filterData(data, "Owner", ["Aperture", "Black Mesa"])
  const myChart = new dimple.chart(svg);
  const airTempData = data.filter((d) => {
    console.log(d.type);
    console.log(d.type === "Air Temp");
    return d.type === "Air Temp";
  });
  const waterTempData = data.filter((d) => d.type === "Water Temp");

  const ml = 40;
  const mt = 10;
  const mr = 50;
  const mb = 25;
  // setMargins(left, top, right, bottom)
  myChart.setMargins(ml, mt, mr, mb);

  const x = myChart.addTimeAxis("x", "time");
  // x.dateParseFormat = '%H:%M:%S'
  // x.ticks = 4
  x.timePeriod = d3.timeHour;
  x.timeInterval = 4;

  x.tickFormat = "%I:%M";
  // x.addOrderRule('time')
  // const y2 = myChart.addMeasureAxis("y", "Temp F");
  const y1 = myChart.addMeasureAxis("y", "F");
  y1.ticks = 4;
  // y2.ticks = 4;
  // y2.title = "Deg .F";
  y1.title = "Deg. F";
  // myChart.addColorAxis('Wind Speed', ['blue', 'yellow'])
  // Min price will be green, middle price yellow and max red
  // myChart.addColorAxis('GST', ['green', 'red'])
  if (!data || !data.length) {
  }

  const airTempMin = getMin(data, "F");
  const airTempMax = getMax(data, "F");
  const waterTempMin = getMin(data, "F");
  const waterTempMax = getMax(data, "F");
  let tempMax = Math.min(airTempMax, waterTempMax);
  let tempMin = Math.min(airTempMin, waterTempMin);

  // console.log({ airTempMax, airTempMin, waterTempMax, waterTempMin })
  // y2.overrideMax = airTempMax + airTempMax * 0.2;
  // y2.overrideMin = airTempMin - airTempMin * 0.2;
  y1.overrideMax = tempMax + tempMax * 0.2;
  y1.overrideMin = tempMin - tempMin * 0.2;

  myChart.assignColor("Water Temp", "green");
  const s1 = myChart.addSeries("type", dimple.plot.line, [x, y1]);
  const s2 = myChart.addSeries("type", dimple.plot.line, [x, y1]);
  s1.data = airTempData;
  s2.data = waterTempData;

  myChart.addLegend(100, 0, 50, 200, "right");

  myChart.draw();
  // const swellArrows = d3
  //   .select(".dimple-series-group-0")
  //   .append("g")
  //   .selectAll("path")
  //   .data(rawData);
  // swellArrows.exit().remove();
  // swellArrows
  //   .enter()
  //   .append("path")
  //   .merge(swellArrows)
  //   .attr("class", "dirArrow")
  //   .attr("transform", waveDir)
  //   .attr("d", drawArrow);

  // function waveDir(d, i) {
  //   const startX = i * ((w - ml - mr) / rawData.length) + ml - 5;
  //   const deg = cardnalToDegrees(d.SwD);
  //   return `rotate(${deg}, ${startX + 5}, ${100})`;
  // }
  // function drawArrow(d, i) {
  //   const startX = i * ((w - ml - mr) / rawData.length) + ml - 5;
  //   return `M ${startX}, 100
  //               l 5, -3.75
  //               l 0, 2.5
  //               l 7.5, 0
  //               l 0, 2.5
  //               l -7.5, 0
  //               l 0, 2.5 z`;
  // }
  // const tooManyTicks = document.querySelectorAll(".dirArrow");
  // const markerCount = 10;
  // Array.from(tooManyTicks).map((d, i, a) =>
  //   i % Math.floor(a.length / markerCount) === 0 ? true : d.remove()
  // );
}

function make_wind_chart(divId, rawData) {
  const data = makeWindData(rawData);

  const w = 275;
  const h = 150;
  const svg = dimple.newSvg(`#${divId}`, w, h);

  const myChart = new dimple.chart(svg, data);

  const ml = 40;
  const mt = 10;
  const mr = 0;
  const mb = 25;
  myChart.setMargins(ml, mt, mr, mb);

  const x = myChart.addTimeAxis("x", "time");

  x.timePeriod = d3.timeHour;
  x.timeInterval = 4;

  x.tickFormat = "%I:%M";
  const y1 = myChart.addMeasureAxis("y", "kts");

  y1.ticks = 4;

  const prop_min = getMin(data, "kts");
  const prop_max = getMax(data, "kts");
  y1.overrideMax = prop_max + prop_max * 0.1;
  y1.overrideMin = prop_min - prop_min * 0.1;

  myChart.assignColor("Wind Speed", "green");
  myChart.addSeries("type", dimple.plot.line);

  myChart.addLegend(100, 0, 50, 200, "right");

  myChart.draw();

  const windDir = (d) => d.WDIR;
  // const direction = parseDirection(parseDegrees(d.WDIR))
  const windArrows = d3
    .select(".dimple-series-group-0")
    .append("g")
    .selectAll("path")
    .data(rawData);
  // console.log({ windArrows })
  windArrows.exit().remove();
  windArrows
    .enter()
    .append("path")
    .merge(windArrows)
    .attr("class", "dirArrow")
    .attr("transform", arrowDir)
    .attr("d", drawArrow);

  function arrowDir(d, i) {
    if (!d.WDIR) return;
    const startX = i * ((w - ml) / rawData.length) + ml - 5;
    return `rotate(${windDir(d) - 90}, ${startX + 5}, ${100})`;
  }

  function drawArrow(d, i) {
    const startX = i * ((w - ml) / rawData.length) + ml - 5;
    return `M ${startX}, 100
              l 5, -3.75
              l 0, 2.5
              l 7.5, 0
              l 0, 2.5
              l -7.5, 0
              l 0, 2.5 z`;
  }

  const tooManyTicks = document.querySelectorAll(".dirArrow");
  const markerCount = 15;
  Array.from(tooManyTicks).map((d, i, a) =>
    i % Math.floor(a.length / markerCount) === 0 ? true : d.remove()
  );
}
function getMin(data, prop) {
  if (!data.length) {
    return 0;
  }

  const _data = data.filter((d) => d[prop] !== undefined);

  return parseFloat(
    _data.reduce((min, p) => (p[prop] < min ? p[prop] : min), _data[0][prop])
  );
}
function getMax(data, prop) {
  if (!data.length) {
    return 0;
  }
  const _data = data.filter((d) => d[prop] !== undefined);
  return parseFloat(
    _data.reduce((max, p) => (p[prop] > max ? p[prop] : max), _data[0][prop])
  );
}
function makeTempData(data) {
  const new_data = [];
  let localTime = convert_GMT_hours(data[0].TIME).timestamp;

  data.forEach((d, i, a) => {
    let timeDiff = 0;
    if (i !== 0) {
      timeDiff = a[i - 1].TIME - d.TIME;
      if (timeDiff < 0) {
        timeDiff = timeDiff + 2400;
      }
    }
    localTime = new Date(localTime - timeDiff * 1000 * 60).getTime();

    let airTemp = d.ATMP;

    if (airTemp && !isNaN(airTemp)) {
      const airTempData = {
        type: "Air Temp",
        time: localTime,
        F: airTemp,
      };
      new_data.push(airTempData);
    }
    let waterTemp = d.WTMP;
    if (waterTemp && !isNaN(waterTemp)) {
      const waterTempData = {
        type: "Water Temp",
        time: localTime,
        F: waterTemp,
      };
      new_data.push(waterTempData);
    }
  });

  return new_data;
}

function makeWaveData(data) {
  const new_data = [];
  let localTime = convert_GMT_hours(data[0].TIME).timestamp;

  data.forEach((d, i, a) => {
    let timeDiff = 0;
    if (i !== 0) {
      timeDiff = a[i - 1].TIME - d.TIME;
      if (timeDiff < 0) {
        timeDiff = timeDiff + 2400;
      }
    }
    localTime = new Date(localTime - timeDiff * 1000 * 60).getTime();

    let swellPeriod = d.SwP || d.DPD;

    if (swellPeriod && !isNaN(swellPeriod)) {
      const period = {
        type: "Period",
        time: localTime,
        Seconds: swellPeriod,
      };
      new_data.push(period);
    }
    let waveHeight = d.SwH || d.WVHT;
    if (waveHeight && !isNaN(waveHeight)) {
      const height = {
        type: "Wave Height",
        time: localTime,
        Ft: waveHeight,
      };
      new_data.push(height);
    }
  });

  return new_data;
}

function makeWindData(data) {
  console.log("making wind data");
  let new_data = [];
  let localTime = convert_GMT_hours(data[0].TIME).timestamp;

  data.forEach((d, i, a) => {
    let timeDiff = 0;
    // console.log(d.TIME)
    if (i !== 0) {
      timeDiff = a[i - 1].TIME - d.TIME;
      if (timeDiff < 0) {
        timeDiff = timeDiff + 2400;
      }
    }
    // const time = convert_GMT_hours(d.TIME).timestamp
    localTime = new Date(localTime - timeDiff * 1000 * 60).getTime();
    // console.log(new Date(localTime))
    // console.log({ localTime, timeDiff })
    const gust = {
      type: "Gust",
      time: localTime,
      kts: +d.GST,
    };
    const wspd = {
      type: "Wind Speed",
      time: localTime,
      kts: +d.WSPD,
    };
    new_data.push(gust);
    new_data.push(wspd);
  });
  /* remove all kts = "-" */
  // console.log(data)
  // console.log(new_data)
  new_data = new_data.filter((d) => !isNaN(d.kts));
  // console.log(new_data)
  return new_data;
}

function convert_GMT_hours(GMT_hour_timestamp) {
  // console.log({ GMT_hour_timestamp })
  // 0700 should return 900PM hawaii
  /* if time is 530, we need it to be 0530 */
  GMT_hour_timestamp = process_GMT_timestamp(GMT_hour_timestamp);
  // console.log({ GMT_hour_timestamp })
  const hour = GMT_hour_timestamp.slice(0, 2);
  const minute = GMT_hour_timestamp.slice(2, 4);
  const offset = new Date().getTimezoneOffset() / 60;

  // console.log({ GMT_date_string })
  let timestamp;
  let hours = hour - offset;
  // console.log({ hours })
  if (hours < 0) {
    hours = hour - offset + 24;
    timestamp = new Date().setHours(hours);
    // const day = 1000 * 60 * 60 * 24
    // timestamp = new Date(timestamp - day).getTime()
  } else {
    timestamp = new Date().setHours(hours);
  }
  timestamp = new Date(timestamp).setMinutes(minute);
  timestamp = new Date(timestamp).setSeconds(0);
  const date_string = new Date(timestamp).toDateString();
  const time_string = new Date(timestamp).toLocaleTimeString();
  // console.log(timestamp)
  // console.log(new Date(timestamp))
  // console.log({ date_string, time_string })
  return { date_string, time_string, timestamp };
}

function process_GMT_timestamp(time) {
  time = String(time);
  if (time.length < 4) {
    time = time.split("");
    time.unshift("0");
    time = time.join("");
  }
  if (time.length < 4) {
    return process_GMT_timestamp(time);
  } else {
    return time;
  }
}

function mapNums(x, in_min, in_max, out_min, out_max) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
