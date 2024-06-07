import React from "react";
import { GoogleMap, useJsApiLoader, Marker, Polyline } from "@react-google-maps/api";
import droneIcon from './../../../Images/drone-icon1.png'; // replace with actual path to the icon file

const containerStyle = {
  width: '1500px',
  height: '600px'
};

function Map1(props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAyOOeicrTp_8wTLPxp-64TCuwl_-OvntM"
  });

  const center = props.location.lat ? props.location : { lat: 37.33590253146588, lng: -121.88253879547119 };

  const placeClicked = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    props.setLocation({ lat, lng });
  };

  const path = props.path || []; // new prop for list of coordinates

  const polylineOptions = { //options for polyline
    strokeColor: "#FF0000", // color of line
    strokeOpacity: 1.0,
    strokeWeight: 2,
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      onClick={placeClicked}
    >
      {props.location.lat && props.location.lng && (
        <Marker 
          position={{ lat: props.location.lat, lng: props.location.lng }} 
          icon={{
            url: droneIcon,
            scaledSize: { width: 30, height: 30 }, // scales icon size
          }}
        />
      )}
      <Polyline
        path={path}
        options={polylineOptions}
      />
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(Map1);
