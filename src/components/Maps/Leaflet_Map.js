import React from 'react';
import getMap, {add_buoy_markers, add_circle} from './getMap';




class Leaflet_Map extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      map:null,
      all_markers:{}
    }
  }
  componentDidMount() {
    console.log(this.props)
    const map = getMap(this.props.handleClick);
    this.setState({map})
  }

  componentDidUpdate(a, b){
    let {map} = this.state
    console.log(this.props)

    let {buoy_data} = this.props
    if(buoy_data){
      console.log(buoy_data)
      let selection = 'wave_data'
    add_buoy_markers(buoy_data,selection ,map)
    }
  }
  render() {
    let {map} = this.state
    
    if(map){
      if(!this.props.latLng){
        map.flyTo([0, 0], 2)
        
      }else
      {let {lat,lng} = this.props.latLng
      map.flyTo([lat, lng], 6)
      /* draw circle */
     add_circle([lat, lng], map)}
    }

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

