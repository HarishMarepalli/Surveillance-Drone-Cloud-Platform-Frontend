import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: '1500px',
    height: '600px'
  };
  
  
  
  function Map(props) {
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: "AIzaSyAyOOeicrTp_8wTLPxp-64TCuwl_-OvntM"
    })

    console.log("CENTERchild:",props.center);

    // const center = {
    //   lat: 37.33590253146588,
    //   lng: -121.88253879547119
    // };

    const center=props.center?props.center:{lat:37.33590253146588,lng:-121.88253879547119};
  
    const [lat,setLat] =React.useState(null);
    const [lng,setLng] =React.useState(null);
    const [markers,setMarkers]=React.useState([]);
    //props.setOrds(markers);
    console.log("MARKERS:",markers);

    const placeClicked = (e) => {
        setMarkers((current) => [
            ...current,
            {
              lat: e.latLng.lat(),
              lng: e.latLng.lng()
            }
          ]);
  }
  
    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={16}
            onClick={placeClicked}
        >
          { /* Child components, such as markers, info windows, etc. */ }
          {/* {markers.map((marker, index) => (
                        <Marker
                        key={index}
                        title={marker.title}
                        name={marker.name}
                        position={marker.position}
                        />
                    ))} */}
            {markers.map((marker,index) => (
                <Marker 
                key={index}
                position={{ 
                    lat: marker.lat,
                    lng: marker.lng 
                }} />
            ))}
        </GoogleMap>
    ) : <></>
  }
  
  export default React.memo(Map);