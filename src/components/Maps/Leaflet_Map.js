import React from 'react';
import getMap from './getMap';
import {add_buoy_markers} from './getMap.js'


class Leaflet_Map extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      map:null
    }
  }
  componentDidMount() {
    console.log(this.props)
    let {lat, lng} = this.props.latLng
    const map = getMap({lat, lng});
    this.setState({map})
  }

  componentDidUpdate(a, b){
    let {map} = this.state

    console.log({a,b})
    let {lat, lng} = a.latLng
    let {buoy_data} = this.props
    if(buoy_data){
      console.log(buoy_data)
      let selection = 'wave_data'
    add_buoy_markers(buoy_data,selection ,map)
    }
  }
  render() {
    let {map} = this.state
    let {lat,lng} = this.props.latLng
    if(map)map.flyTo([lat, lng], 6)

    return (
      <div id='map' style={{
        width: '100%',
        height: '400px',
      }}>

      </div>
    );
  }
}



export default Leaflet_Map;

