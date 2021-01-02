let map

export default function getMap (handleClick) {
  if (!map) {
    map = require('./createMap').default(handleClick)
  }

  return map
}

let markers
export function add_buoy_markers (buoy_data, selection, map) {
  if (!markers) {
    // console.log({ buoy_data })
    markers = require('./createMap.js').create_markers(buoy_data, selection, map)
  }
}

export function add_circle ([lat, lng], map) {
  require('./createMap.js').add_circle([lat, lng], map)
}
