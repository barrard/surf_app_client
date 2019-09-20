let map;

export default function getMap({lat, lng}) {
    if (!map) {
        map = require('./createMap').default({lat, lng});
    }

    return map;
}


let markers;
export function add_buoy_markers(buoy_data, selection, map){
    if(!markers){

        console.log(buoy_data)
        markers = require('./createMap.js').create_markers(buoy_data,selection,  map)
    }

}