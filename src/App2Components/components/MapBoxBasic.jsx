import React, { useRef, useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpdGVqYTM3NyIsImEiOiJjbHNncXBrZGIyMjB1MmtxbGJzZmhkcWtrIn0.3K08_P7Sxk2fE__xAT-TEA';

export default function MapBoxBasic({
  trackdroneData, 
  countDrones, 
  listDrones, 
  onMarkerClick, 
  longitude=-121.8836464, 
  latitude=37.3351916,
  zoomVal=16
}) {
  const mapContainer = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const map = useRef(null);
  const [lng, setLng] = useState(longitude);
  const [lat, setLat] = useState(latitude);
  const [zoom, setZoom] = useState(zoomVal);

  // const handleMarkerClick = (droneId) => {
  //   navigate(`/dashboard/tracking/${droneId}`);
  // };

  function removeMarkersFromMap() {
    // Get all markers on the map
    const markers = document.getElementsByClassName('globalMarker');
    
    // Remove each marker from the map
    while (markers.length > 0) {
        const marker = markers[0];
        marker.parentNode.removeChild(marker); // Remove marker from DOM
    }
  }

  useEffect(() => {
    //if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    // Add the control to the map.
    map.current.addControl(
      new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      zoom: 16
      })
    );

    map.current.addControl(new mapboxgl.NavigationControl());
    
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on('style.load', ()=>{
      
      //  // Check if the 'places' source already exists
      //   if (map.current.getSource('places')) {
      //     // Remove the existing 'places' source
      //     map.current.removeSource('places');
      // }

      removeMarkersFromMap();

      if (!map.current.getSource('places')) 
      {
        map.current.addSource('places', trackdroneData);
          //console.log(trackdroneData);

          // Add markers to the map.
        for (const marker of trackdroneData.data.features) {
          // Create a DOM element for each marker.
          const el = document.createElement('div');
          const width = marker.properties.iconSize[0];
          const height = marker.properties.iconSize[1];
          const status = marker.properties.status;
          const id = marker.id;
          el.className = 'globalMarker marker'+id + ' drone' + status.toLowerCase();
          el.style.backgroundImage = `url(${marker.properties.imgUrl})`;
          el.style.width = `${width}px`;
          el.style.height = `${height}px`;
          el.style.backgroundSize = '100%';
          el.style.cursor = 'pointer';
          // if(status == 'Stopped')
          // {
          //   el.style.animation = "pulse 1s infinite alternate";
          // }

          // Function to animate the marker
          // function animateMarker() {
          //   let scale = 1.2;
          //   let opacity = 0.4;
          //   const animate = () => {
          //     scale = scale === 1 ? 1.2 : 1;
          //     opacity = opacity === 0.4 ? 0.8 : 0.4;
          //     el.style.transform = `scale(${scale})`;
          //     el.style.opacity = opacity;
          //     setTimeout(animate, 1000); // Adjust the pulsating speed here
          //   };
          //   animate();
          // }

          // // Start the pulsating animation
          // animateMarker();

          const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false }) // add popups
          .setHTML(
          `<p class='markerDescTitle'>${marker.properties.description}</p>`);
          
          // Add markers to the map.
          new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .setPopup(popup)
          .addTo(map.current);

          // Show popup on hover
          el.addEventListener('mouseenter', function() {
            popup.addTo(map.current);
          });

          // Hide popup when mouse leaves marker
          el.addEventListener('mouseleave', function() {
            popup.remove();
          });

          // Add click event listener to each marker
          el.addEventListener('click', () => {
            onMarkerClick(marker.id);
          });
        }
      }
  });


    map.current.on('render', (function() {
        function intersectRect(r1, r2) {
          return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
        }
    
        function getVisibleMarkers() {
          var cc = map.current.getContainer();
          var els = cc.getElementsByClassName('globalMarker');
          //console.log(els);
          var ccRect = cc.getBoundingClientRect();
          var visibles = [];
          for (var i = 0; i < els.length; i++) {
            var el = els.item(i);
            var elRect = el.getBoundingClientRect();
            intersectRect(ccRect, elRect) && visibles.push(el);
          }
          //if (visibles.length > 0) console.log(visibles);
          //console.log(visibles);
          let visDrones = [];
          if (visibles.length > 0)
          for(var i=0; i<visibles.length; i++)
          {
            visDrones.push(visibles[i].classList[1])
            //console.log(visDrones);
            
          }
          listDrones(visDrones)
          //if(visibles.length == 0) listDrones()
          countDrones(visibles.length);
        }
    
        var tm;
        return function() {
          clearTimeout(tm);
          tm = setTimeout(getVisibleMarkers, 100);
        }
      }()))

      return () => {
        // Cleanup function to remove markers when component unmounts
        removeMarkersFromMap();
    }
    
  },[trackdroneData]);

  return (
    <Box>
      {/* <Box className="sidebar-map">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </Box> */}
      <Box ref={mapContainer} className="map-container" />
      <style>
          {`.mapboxgl-popup-content {
            color: ${theme.palette.neutral.dark} !important;
        background-color: ${theme.palette.secondary.main} !important;
      },
      .mapboxgl-popup-tip
      {
        border-top-color: ${theme.palette.secondary.main} !important;
      }
      `}
      </style>
    </Box>
  );
}
