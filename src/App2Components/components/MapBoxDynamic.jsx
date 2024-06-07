import React, { useRef, useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { BASE_URL, API_ENDPOINTS } from '../../config';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpdGVqYTM3NyIsImEiOiJjbHNncXBrZGIyMjB1MmtxbGJzZmhkcWtrIn0.3K08_P7Sxk2fE__xAT-TEA';

export default function MapBoxDynamic({droneTrackMapData,selectedMissionID,selectedMission,liveNotification}) {
  const mapContainer1 = useRef(null);
  const map1 = useRef(null);
  const markerRef = useRef(null);
  const theme = useTheme();
  const waypointLng0 = selectedMission[0].mission_waypoints[0].longitude;
  const waypointLat0 = selectedMission[0].mission_waypoints[0].latitude;
  const [lng, setLng] = useState(waypointLng0);
  const [lat, setLat] = useState(waypointLat0);
  const [zoom, setZoom] = useState(17);
  const [lineCoords, setLineCoords] = useState([]);
  const [waypointCoords, setWaypointCoords] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));

  useEffect(() => {
    // Fetch line coordinates from the backend
    //console.log("Fetching Line Coords");
    const fetchLineCoords = async () => {
      try {
        //const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.getLineCoordsForMission}/${selectedMissionID}`); // Adjust the API endpoint as needed
        const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.getLineCoordsForMission}/`,{
          params: {
            missionId: selectedMissionID,
            userId: userdetails.email
          }
        }); // Adjust the API endpoint as needed
        setLineCoords(response.data); // Update state with fetched line coordinates
        setDataFetched(true);
        //console.log(response.data);
      } catch (error) {
        console.error('Error fetching line coordinates:', error);
      }
    };

    fetchLineCoords(); // Call fetchLineCoords when the component mounts

    let waypointCoordinates = selectedMission[0].mission_waypoints.map(waypoint => [waypoint.longitude, waypoint.latitude]);
    // Add the first waypoint (deck station) as the last point to close the polygon
    waypointCoordinates.push(waypointCoordinates[0]);
    setWaypointCoords(waypointCoordinates);
  }, []);

  useEffect(() => {
    //if (map.current) return; // initialize map only once
    if(dataFetched)
    {
        //console.log("Creating Map");
        if (!map1.current) 
        {
            map1.current = new mapboxgl.Map({
                container: mapContainer1.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: zoom
            });
        
            // Add the control to the map.
            map1.current.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                zoom: 16
                })
            );
        
            map1.current.addControl(new mapboxgl.NavigationControl());
            
            map1.current.on('move', () => {
                setLng(map1.current.getCenter().lng.toFixed(4));
                setLat(map1.current.getCenter().lat.toFixed(4));
                setZoom(map1.current.getZoom().toFixed(2));
            });
        
            // Create custom marker
            const marker = droneTrackMapData.data.features[0];
            const rotationAngle = marker.properties.heading;
            const el = document.createElement('div');
            const width = 75;
            const height = 75;
            const status = marker.properties.status;
            const id = marker.id;
            el.className = 'globalLiveMarker liveMarker'+id + ' drone' + status.toLowerCase();
            el.style.backgroundImage = `url(${marker.properties.imgUrl})`;
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.backgroundSize = '100%';
            el.style.cursor = 'pointer';
            const rotateString = `rotate(${rotationAngle}deg)`;
            //el.style.transform = el.style.transform + rotateString;
            //el.style.transform = `rotate(${rotationAngle}deg)`; // Apply rotation here  
            el.style.transition = `transform 1000ms ease`
            //el.style.transform = el.style.transform + `rotateY(${rotationAngle}deg)`;
            //el.style.rotate = `y ${rotationAngle}deg`;
            //el.style.transform = `rotateY(${rotationAngle}deg)`
            markerRef.current = new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map1.current);
            //alert('Hi')
            //console.log(el.style.transform);
            //el.style.transform = el.style.transform + `rotateY(${rotationAngle}deg)`;
            //el.style.transform = `rotateY(${rotationAngle}deg)`; // Apply rotation here  
            markerRef.current.setRotation(rotationAngle-180);
            

            //console.log("Adding Line Source and Layer");
            map1.current.on('style.load', () => {
                //console.log("Map Loaded");
                 // Add line source
                //This line source will be added whenever the map first loads.
                map1.current.addSource('line', {
                  type: 'geojson',
                  data: {
                      type: 'Feature',
                      properties: {},
                      geometry: {
                          type: 'LineString',
                          coordinates: lineCoords
                      }
                  }
              });
              
                // Add line layer
                map1.current.addLayer({
                  id: 'line',
                  type: 'line',
                  source: 'line',
                  layout: {
                      'line-join': 'round',
                      'line-cap': 'round'
                  },
                  paint: {
                      'line-color': '#f00',
                      'line-width': 10
                  }
              });

               

                //Add Mission Waypoints Polygon
                map1.current.addLayer({
                  id: 'mission-polygon',
                  type: 'line',
                  source: {
                      type: 'geojson',
                      data: {
                          type: 'Feature',
                          geometry: {
                              type: 'LineString',
                              coordinates: waypointCoords
                          }
                      }
                  },
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  paint: {
                      'line-color': 'blue',
                      'line-width': 5
                  }
              });
            });
        }
    }
    return () => {
        if (map1.current) 
        {
            //console.log("Unmounting..");
            map1.current.removeLayer('line');
            map1.current.removeSource('line');
            map1.current.remove();
            map1.current = null;
        }
    }
  },[dataFetched]);

  //This useEffect is when the live data is coming from the drone
  useEffect(()=>{
    if(dataFetched)
    {
        //console.log("Updating Real Coordinates From Simulator");
        if (droneTrackMapData && droneTrackMapData.data.features.length > 0) {
            const marker = droneTrackMapData.data.features[0];
            const coordinates = marker.geometry.coordinates;
            //const rotationAngle = (marker.properties.yaw) * (180/Math.PI)
            const rotationAngle = marker.properties.heading
            const status = marker.properties.status;
            const id = marker.id;
            const markerElement = markerRef.current.getElement();
            if (markerElement) {
                markerElement.className = `globalLiveMarker liveMarker${id} drone${status.toLowerCase()}`;
            }
            markerElement.style.transition = `transform 1000ms ease`;
            markerRef.current.setRotation(rotationAngle-180);
            markerRef.current.setLngLat(coordinates);
            // Update line geometry
            if(map1.current.getSource('line'))
            {
                const lineCoordinates = map1.current.getSource('line')._data.geometry.coordinates;
                lineCoordinates.push(coordinates);
                map1.current.getSource('line').setData({
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: lineCoordinates
                    }
                });
            }
        }
    }
  }, [dataFetched, droneTrackMapData])

  useEffect(() => {
    if(dataFetched)
    {
      if (Object.keys(liveNotification).length !== 0) {
        if (liveNotification.message.includes("Image") || liveNotification.message.includes("Video")) {
          //console.log(liveNotification.message);
          const markerPopup = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false }).setHTML(
            `<p class='markerDescTitle'>${liveNotification.message}</p>`
          );
          // console.log(markerRef);
          markerRef.current.setPopup(markerPopup).addTo(map1.current);
          markerPopup.addTo(map1.current)

          // Remove the popup after 3 seconds
          setTimeout(() => {
            markerPopup.remove();
          }, 3000);
        }
      }
    }
  }, [dataFetched, liveNotification]);

  return (
    <Box>
      <Box ref={mapContainer1} className="map-container-dynamic" />
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
