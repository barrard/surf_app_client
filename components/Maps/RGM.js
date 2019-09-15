import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

export function MyMap(props){
  let {markers, center} = props
  const MapWithAMarker = withScriptjs(withGoogleMap(props =>
    <GoogleMap
      defaultZoom={7}
      defaultCenter={center}
    >
      {markers.map((marker, key)=>(

      <Marker
      key={key}
        position={marker}
      />))}
    </GoogleMap>
  ));
  
  
   return(
    <MapWithAMarker
    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE}&v=3.exp&libraries=geometry,drawing,places`}
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `400px` }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />      
   )
  
}