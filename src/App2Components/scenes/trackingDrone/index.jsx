import React from 'react'
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import PropertyValueCard from '../../components/PropertyValueCard';
import PropertyValueCard1 from '../../components/PropertyValueCard1';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { tokens } from "../../theme";
import { useParams } from 'react-router-dom';
import DroneDetailsCard from '../../components/DroneDetailsCard';
import MissionDetailsCard from '../../components/MissionDetailsCard';
import MapBoxDynamic from "../../components/MapBoxDynamic";
import BatteryIndicator from "../../components/BatteryIndicator";
import LiveNotificationCard from '../../components/LiveNotificationCard';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SwitchVideoIcon from '@mui/icons-material/SwitchVideo';
import io from 'socket.io-client';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import { BASE_URL, API_ENDPOINTS } from '../../../config';

const droneDetailsData = {
    "drone_id": "D001",
    "name": "DJI Mavic Air 2",
    "model": "Mavic Air 2",
    "type": "QuadCopter",
    "manufacturer": "DJI",
};

const missionDetailsData = {
    "mission_id": "M001",
    "mission_type": "Campus Surveillance",
    "mission_location": "San Jose State University",
    "mission_distance": 370.2,
    "trip_id": "T001",
}

const mockdrone = {
    'type': 'geojson',
    'data': {
        'type': 'FeatureCollection',
        'features': [
            {
                'id': 'D001',
                'type': 'Feature',
                'properties': {
                  'name': 'DJI Phantom',
                  'status': 'Active',
                  'message': 'Foo',
                  'iconSize': [75, 75],
                  'imgUrl': '/images/drone1.png',
                  'description': "<strong>Drone D001</strong><p class='desc'>San Jose State University</p>"
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-121.8836464, 37.3351916]
                }
            }
        ]
    }
}

const initGeoJSON = {
    'type': 'geojson',
    'data': {
        'type': 'FeatureCollection',
        'features': [
            {
                id: '',
                type: 'Feature',
                properties: {
                    name: '',
                    status: '',
                    message: '',
                    heading: 241,
                    imgUrl: '/images/drone1.png', // Replace with actual image URL
                    //description: `<strong>Drone-ID: ${drone.drone_id}</strong><p class='desc'>Mission-ID: ${drone.mission_id}</p><p class='desc'>${drone.mission_type}</p><p class='desc'>${drone.mission_location}</p>`
                },
                geometry: {
                    type: 'Point',
                    coordinates: [-121.88162183, 37.33783684]
                }
            }
        ]
    }
  };

const initInfoTrackData = {
    drone_id: '',
    drone_name: '',
    drone_status: 'Connected',
    mission_id: '',
    //missionType: selectedMission[0].mission_type,
    mission_status: '',
    telemetry:{
        location: {
            longitude: 0.0,
            latitude: 0.0,
            altitude: 0.0
        },
        position: {
            heading: 0,
            direction: '-',
            pitch: 0.0,
            roll: 0.0,
            yaw: 0.0
        },
        velocity: {
            airspeed: 0.0,
            groundspeed: 0.0,
            velocityX: 0.0,
            velocityY: 0.0,
            velocityZ: 0.0
        },
        iot: {
            temperature: 0.0,
            humidity: 0.0,
            pressure: 0.0,
            soundLevel: 0.0,
            battery: 100.0
        },
        health: {
            flightTime: 0,
            motorPerformance: 0,
            propellerCondition: 0,
            cameraHealth: 'Good',
            batteryvoltage: 0.0,
            batterycurrent: 0.0,
            signalStrength: 0.0
        },
    }
}

const defaultConfig = {
    iot: {
      battery: true,
      pressure: true,
      soundLevel: true,
      temperature: true,
      humidity: true,
    },
    health: {
      batteryvoltage: true,
      signalStrength: true,
      batterycurrent: true,
      propellerCondition: true,
      cameraHealth: true,
      motorPerformance: true,
      flightTime: true,
    },
    location: {
      latitude: true,
      longitude: true,
      altitude: true,
    },
    velocity: {
      velocityZ: true,
      groundspeed: true,
      velocityX: true,
      velocityY: true,
      airspeed: true,
    },
    position: {
      roll: true,
      direction: true,
      yaw: true,
      heading: true,
      pitch: true,
    },
};

const TrackingDrone = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { droneId, missionId } = useParams();
    const [mapTrackData, setMapTrackData] = useState(initGeoJSON);
    const [selectedDroneID, setSelectedDroneID] = useState(droneId);
    const [selectedMissionID, setSelectedMissionID] = useState(missionId);
    const [selectedDrone, setSelectedDrone] = useState([]);
    const [selectedMission, setSelectedMission] = useState([]);
    const [expanded, setExpanded] = React.useState('location');
    const [infoTrackData, setInfoTrackData] = useState(initInfoTrackData);
    const [missionConfig, setMissionConfig] = useState(defaultConfig);
    const [notifications, setNotifications] = useState([]);
    const [liveNotification, setLiveNotification] = useState({});
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
      });
    const { vertical, horizontal, open } = state;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setState({ ...state, open: false });
    };

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    //const [dataFetched, setDataFetched] = useState(false);

    const getSelectedDrone = async ()=>{
        const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getOneDrone}/${selectedDroneID}`);
        //console.log(res.data);
        return res.data;
    }

    const getSelectedMission = async ()=>{
        const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getOneMission}/${selectedMissionID}`);
        //console.log(res.data);
        return res.data;
    }

    const getMissionTrackingConfig = async (missionId) => {
        try {
            //console.log(missionId);
            const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getConfiguredTracking}`, {
              params: {
                missionId: missionId
              }
            });
            return res.data;
          } catch (error) {
            //console.error('Error:', error);
            throw error;
        }
    };

    const getNotificationsForMission = async (missionId)=>{
        const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getNotificationsForMission}`, {
            params: {
                missionId: missionId
            }
        });
        //console.log(res.data);
        return res.data;
    }

    useEffect(()=>{
        //console.log(droneId + " " + missionId);

        async function fetchData() {
            //Saiteja
            const selectedDroneData = await getSelectedDrone();
            setSelectedDrone(selectedDroneData);
            //setSelectedDroneID(selectedDrone[0].drone_id);
            //console.log(selectedDrone);

            const selectedMissionData = await getSelectedMission();
            setSelectedMission(selectedMissionData);
            //setDataFetched(true);
            //setSelectedMissionID(selectedMission[0].mission_id);
            //console.log(selectedMission);

            const notifdata = await getNotificationsForMission(missionId);
            const sortedNotifications = notifdata.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            // console.log(sortedNotifications);
            setNotifications(sortedNotifications);

            const {config} = await getMissionTrackingConfig(missionId);
            //console.log(config);
            setMissionConfig(config);
          }
          fetchData();
        
          const socket = io(`${BASE_URL}`);  // Connect to your backend WebSocket server
          socket.emit('joinMission', missionId);
          socket.on('telemetry', (data) => {
            //console.log(data);
            const temp = convertToGeoJSON(data);
            //console.log(temp);
            setMapTrackData(temp);
            setInfoTrackData(data);
        });

        socket.on('notification', (data) => {
            //console.log(data);
            setNotifications(prevNotifications => [data, ...prevNotifications]);
            setLiveNotification(data);
            setState({ ...state, open: true });
        });
        return () => {
            socket.emit('leaveMission', missionId);
            socket.disconnect()
        };
    },[])

    useEffect(()=>{
        if(selectedMission.length>0 && selectedDrone.length>0)
        {
            const waypointLng0 = selectedMission[0].mission_waypoints[0].longitude;
            const waypointLat0 = selectedMission[0].mission_waypoints[0].latitude;
            const iniData = {
                drone_id: selectedDrone[0].drone_id,
                drone_name: selectedDrone[0].name,
                drone_status: 'Connected',
                mission_id: selectedMission[0].mission_id,
                //missionType: selectedMission[0].mission_type,
                mission_status: selectedMission[0].mission_status,
                telemetry:{
                    location: {
                        longitude: waypointLng0,
                        latitude: waypointLat0,
                        altitude: 0.0
                    },
                    position: {
                        heading: 0,
                        direction: '-',
                        pitch: 0.0,
                        roll: 0.0,
                        yaw: 0.0
                    },
                    velocity: {
                        airspeed: 0.0,
                        groundspeed: 0.0,
                        velocityX: 0.0,
                        velocityY: 0.0,
                        velocityZ: 0.0
                    },
                    iot: {
                        temperature: 0.0,
                        humidity: 0.0,
                        pressure: 0.0,
                        soundLevel: 0.0,
                        battery: 100.0
                    },
                    health: {
                        flightTime: 0,
                        motorPerformance: 0,
                        propellerCondition: 0,
                        cameraHealth: 'Good',
                        batteryvoltage: 0.0,
                        batterycurrent: 0.0,
                        signalStrength: 0.0
                    },
                }
            }
            setMapTrackData(convertToGeoJSON(iniData));
            setInfoTrackData(iniData);
        }
        
    },[selectedMission, selectedDrone])

    /* HELPER METHODS */
  function convertToGeoJSON(data) {
    return {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
            {
                id: data.drone_id,
                type: 'Feature',
                properties: {
                    name: data.drone_name,
                    status: data.drone_status,
                    message: '',
                    heading: data.telemetry.position.heading,
                    iconSize: [75, 75], // Adjust icon size as needed
                    imgUrl: '/images/drone1.png', // Replace with actual image URL
                    //description: `<strong>Drone-ID: ${drone.drone_id}</strong><p class='desc'>Mission-ID: ${drone.mission_id}</p><p class='desc'>${drone.mission_type}</p><p class='desc'>${drone.mission_location}</p>`
                },
                geometry: {
                    type: 'Point',
                    coordinates: [data.telemetry.location.longitude, data.telemetry.location.latitude]
                }
            }
        ]
      }
    };
  }

  function areAllFieldsFalse(category, config) {
        const fields = config[category];
        for (const field in fields) {
            if (fields.hasOwnProperty(field) && fields[field]) {
                return false; // If any field is true, return false
            }
        }
        return true; // If all fields are false, return true
    }

  return (
    <Box 
      m="20px" 
      display="grid" 
      gridTemplateColumns="1fr 1fr 1fr"
      //gridTemplateRows="repeat(4, 1fr)"
      gap="20px"
    >
        {/* Drone Details */}
        <Box 
            //border="1px solid #fff"
            //backgroundColor="dodgerblue"
            backgroundColor={theme.palette.neutral.light}
            borderRadius="20px"
            boxShadow="0px 0px 13px 0px rgba(96,125,139,0.89)"
            display="flex"
            alignItems="center"
            gridRow="1/2"
        >
            {selectedDrone.length>0 && <DroneDetailsCard data = {selectedDrone[0]}/>}
        </Box>

        {/* Mission and Trip Details */}
        <Box
            //backgroundColor="chocolate"
            backgroundColor={theme.palette.neutral.light}
            borderRadius="20px"
            boxShadow="0px 0px 13px 0px rgba(96,125,139,0.89)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gridRow="1/2"
            padding="1em"
        >
            {selectedMission.length>0 && <MissionDetailsCard data = {selectedMission[0]} selectedDroneId={selectedDrone[0].drone_id}/>}
        </Box>

        <Box
            gridRow="1/3"
            display="grid"
            rowGap="20px"
        >
            {/* Live Notifications */}
            <Box 
                //backgroundColor="darkcyan"
                backgroundColor={theme.palette.neutral.light}
                borderRadius="20px"
                boxShadow="0px 0px 13px 0px rgba(96,125,139,0.89)"
                display="flex"
                alignItems="center"
                flexDirection="column"
                //justifyContent="center"
                //gridRow="1/25"
                height="400px"
                overflow="auto"
                padding="1em"
                paddingTop="2em"
                //padding="2em"
            >
                <Typography 
                    marginBottom="15px" 
                    variant="h3"
                    fontWeight="bold"
                    // sx={{ color: colors.grey[900] }}
                    color={theme.palette.neutral.dark}
                    textAlign="center"
                >
                    Live Notifications
                </Typography>
                <div className="liveNotifContainer">
                    {/* {notifications.map((notification, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    <p>{notification.message}</p>
                                    <p>Category: {notification.msg_category}</p>
                                    <p>Command: {notification.mav_command}</p>
                                </div>
                    ))} */}
                    {
                        notifications.length == 0 && <p>No Live Notifications</p>
                    }
                    <LiveNotificationCard liveNotifications={notifications} />
                </div>
            </Box>

            {/* Tracking Info */}
            <Box 
                borderRadius="20px" 
                //backgroundColor='darkmagenta'
                backgroundColor={theme.palette.neutral.light}
                boxShadow="0px 0px 13px 0px rgba(96,125,139,0.89)"
            >
                <Box padding='30px' >
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        // sx={{ color: colors.grey[900] }}
                        color={theme.palette.neutral.dark}
                        textAlign="center"
                    >
                        Operational Status
                    </Typography>
                    <Box
                        display="grid"
                        padding="1em"
                        margin="1em"
                        gap="30px"
                        gridTemplateColumns="1fr 1fr"
                    >
                        
                        <PropertyValueCard color={theme.palette.neutral.dark} property="Drone Status" value={infoTrackData.drone_status}/>
                        <PropertyValueCard color={theme.palette.neutral.dark} property="Mission Status" value={infoTrackData.mission_status}/>
                    </Box>
                    <BatteryIndicator 
                        batteryPercentage = {Math.round(infoTrackData.telemetry.iot.battery)}
                    />
                </Box>
                <div>
                    { !areAllFieldsFalse("location", missionConfig) &&
                        <Accordion 
                            expanded={expanded === 'location'} 
                            onChange={handleChange('location')}
                            sx={{
                                //backgroundColor: 'darkorchid',
                                backgroundColor:theme.palette.secondary.main,
                                margin: '20px !important', 
                                borderRadius: '20px !important',
                                "& .MuiAccordionSummary-expandIconWrapper": {
                                    color: theme.palette.neutral.light
                                }
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="location-content" id="location-header">
                                <Typography color={theme.palette.neutral.light} fontSize='22px'>Location Tracking</Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    display:"grid",
                                    padding:"0em",
                                    margin:"1em",
                                    gap:"30px",
                                    gridTemplateColumns:"1fr 1fr"
                                }}
                            >
                                { missionConfig.location.latitude &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Latitude" 
                                        value={infoTrackData.telemetry.location.latitude.toFixed(4)}
                                    />
                                }
                                { missionConfig.location.longitude &&
                                    <PropertyValueCard1
                                        color={theme.palette.neutral.light} 
                                        property="Longitude" 
                                        value={infoTrackData.telemetry.location.longitude.toFixed(4)}
                                    />
                                }
                                { missionConfig.location.altitude &&
                                    <PropertyValueCard1
                                        color={theme.palette.neutral.light}
                                        property="Altitude" 
                                        value={infoTrackData.telemetry.location.altitude.toFixed(2) + 'm'}
                                    />
                                }
                            </AccordionDetails>
                        </Accordion>
                    }

                    {   !areAllFieldsFalse("position", missionConfig) &&
                        <Accordion 
                            expanded={expanded === 'position'} 
                            onChange={handleChange('position')}
                            sx={{
                                //backgroundColor: 'darkorchid',
                                backgroundColor:theme.palette.secondary.main,
                                margin: '20px !important', 
                                borderRadius: '20px !important',
                                "& .MuiAccordionSummary-expandIconWrapper": {
                                    color: theme.palette.neutral.light
                                }
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="position-content" id="position-header">
                                <Typography color={theme.palette.neutral.light} fontSize='22px'>Position Tracking</Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    display:"grid",
                                    padding:"0em",
                                    margin:"1em",
                                    gap:"30px",
                                    gridTemplateColumns:"1fr 1fr"
                                }}
                            >
                                { missionConfig.position.heading &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Heading" 
                                        value={infoTrackData.telemetry.position.heading + '°'}
                                    />
                                }
                                { missionConfig.position.direction &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Direction" 
                                        value={infoTrackData.telemetry.position.direction} 
                                    />
                                }
                                { missionConfig.position.pitch &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Pitch" 
                                        value={infoTrackData.telemetry.position.pitch.toFixed(2) + 'rad'}
                                    />
                                }
                                { missionConfig.position.roll &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Roll" 
                                        value={infoTrackData.telemetry.position.roll.toFixed(2) + 'rad'}
                                    />
                                }
                                { missionConfig.position.yaw &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Yaw" 
                                        value={infoTrackData.telemetry.position.yaw.toFixed(2) + 'rad'}
                                    />
                                }
                            </AccordionDetails>
                        </Accordion>
                    }

                    {   !areAllFieldsFalse("velocity", missionConfig) &&
                        <Accordion 
                            expanded={expanded === 'velocity'} 
                            onChange={handleChange('velocity')}
                            sx={{
                                //backgroundColor: 'darkorchid',
                                backgroundColor:theme.palette.secondary.main,
                                margin: '20px !important', 
                                borderRadius: '20px !important',
                                "& .MuiAccordionSummary-expandIconWrapper": {
                                    color: theme.palette.neutral.light
                                }
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="velocity-content" id="velocity-header">
                            <Typography color={theme.palette.neutral.light} fontSize='22px'>Velocity Tracking</Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    display:"grid",
                                    padding:"0em",
                                    margin:"1em",
                                    gap:"30px",
                                    gridTemplateColumns:"1fr 1fr"
                                }}
                            >
                                { missionConfig.velocity.airspeed &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Airspeed" 
                                        value={infoTrackData.telemetry.velocity.airspeed.toFixed(2) + 'm/s'}
                                    />
                                }
                                { missionConfig.velocity.groundspeed &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Groundspeed" 
                                        value={infoTrackData.telemetry.velocity.groundspeed.toFixed(2) + 'm/s'}
                                    />
                                }
                                { missionConfig.velocity.velocityX &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Velocity X" 
                                        value={infoTrackData.telemetry.velocity.velocityX.toFixed(2) + 'm/s'}
                                    />
                                }
                                { missionConfig.velocity.velocityY &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Velocity Y" 
                                        value={infoTrackData.telemetry.velocity.velocityY.toFixed(2) + 'm/s'}
                                    />
                                }
                                { missionConfig.velocity.velocityZ &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Velocity Z" 
                                        value={infoTrackData.telemetry.velocity.velocityZ.toFixed(2) + 'm/s'}
                                    />
                                }
                            </AccordionDetails>
                        </Accordion>
                    }
                    {   !areAllFieldsFalse("iot", missionConfig) &&
                        <Accordion 
                            expanded={expanded === 'iot'} 
                            onChange={handleChange('iot')}
                            sx={{
                                //backgroundColor: 'darkorchid',
                                backgroundColor:theme.palette.secondary.main,
                                margin: '20px !important', 
                                borderRadius: '20px !important',
                                "& .MuiAccordionSummary-expandIconWrapper": {
                                    color: theme.palette.neutral.light
                                }
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="iot-content" id="iot-header">
                            <Typography color={theme.palette.neutral.light} fontSize='22px'>IOT Tracking</Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    display:"grid",
                                    padding:"0em",
                                    margin:"1em",
                                    gap:"30px",
                                    gridTemplateColumns:"1fr 1fr"
                                }}
                            >
                                { missionConfig.iot.temperature &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Temperature" 
                                        value={infoTrackData.telemetry.iot.temperature.toFixed(2) + '°C'}
                                    />
                                }
                                { missionConfig.iot.humidity &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Humidity" 
                                        value={infoTrackData.telemetry.iot.humidity.toFixed(2) + '%'}
                                    />
                                }
                                { missionConfig.iot.pressure &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Pressure" 
                                        value={infoTrackData.telemetry.iot.pressure.toFixed(2) + 'mb'}
                                    />
                                }
                                { missionConfig.iot.soundLevel &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="SoundLevel" 
                                        value={infoTrackData.telemetry.iot.soundLevel.toFixed(2) + 'dB'}
                                    />
                                }
                                { missionConfig.iot.battery &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Battery" 
                                        value={infoTrackData.telemetry.iot.battery.toFixed(2) + '%'}
                                    />
                                }
                            </AccordionDetails>
                        </Accordion>
                    }

                    {   !areAllFieldsFalse("health", missionConfig) &&
                        <Accordion 
                            expanded={expanded === 'health'} 
                            onChange={handleChange('health')}
                            sx={{
                                //backgroundColor: 'darkorchid',
                                backgroundColor:theme.palette.secondary.main,
                                margin: '20px !important', 
                                borderRadius: '20px !important',
                                "& .MuiAccordionSummary-expandIconWrapper": {
                                    color: theme.palette.neutral.light
                                }
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="health-content" id="health-header">
                            <Typography color={theme.palette.neutral.light} fontSize='22px'>Health Tracking</Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    display:"grid",
                                    padding:"0em",
                                    margin:"1em",
                                    gap:"30px",
                                    gridTemplateColumns:"1fr 1fr"
                                }}
                            >
                                { missionConfig.health.flightTime &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Flight Time" 
                                        value={Math.round(infoTrackData.telemetry.health.flightTime) + 'sec'}
                                    />
                                }
                                { missionConfig.health.motorPerformance &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Motor Performance" 
                                        value={infoTrackData.telemetry.health.motorPerformance.toFixed(2) + '%'}
                                    />
                                }
                                { missionConfig.health.propellerCondition &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Propeller Condition" 
                                        value={infoTrackData.telemetry.health.propellerCondition.toFixed(2) + '%'}
                                    />
                                }
                                { missionConfig.health.cameraHealth &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Camera Health" 
                                        value={infoTrackData.telemetry.health.cameraHealth}
                                    />
                                }
                                { missionConfig.health.batteryvoltage &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Battery Voltage" 
                                        value={infoTrackData.telemetry.health.batteryvoltage.toFixed(2) + 'V'}
                                    />
                                }
                                { missionConfig.health.batterycurrent &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Battery Current"
                                        value={infoTrackData.telemetry.health.batterycurrent.toFixed(2) + 'A'}
                                    />
                                }
                                { missionConfig.health.signalStrength &&
                                    <PropertyValueCard1 
                                        color={theme.palette.neutral.light}
                                        property="Signal Strength" 
                                        value={infoTrackData.telemetry.health.signalStrength.toFixed(2) + '%'}
                                    />
                                }
                            </AccordionDetails>
                        </Accordion>
                    }
                </div>
            </Box>
        </Box>

        {/* Dynamic Map */}
        <Box gridColumn="span 2">
            <div style={{gridColumn:"span 2", marginTop: '20px'}} className="legend">
                <div className="legend-item">
                    <div className="square1" style={{ backgroundColor: 'blue' }}></div>
                    <span style={{fontSize: '18px'}}>Mission Plan</span>
                </div>
                <div className="legend-item">
                    <div className="square1" style={{ backgroundColor: 'red'}}></div>
                    <span style={{fontSize: '18px'}}>Actual Path</span>
                </div>
            </div>
            
            <Box 
                //border="1px solid #fff"
                //gridColumn="span 2"
                //width="70%"
            >
                {selectedMission.length>0 &&
                    <MapBoxDynamic 
                        droneTrackMapData={mapTrackData}
                        selectedMissionID={selectedMissionID}
                        selectedMission={selectedMission}
                        liveNotification = {liveNotification}
                    />
                }
            </Box>
        
        </Box>

        {/* Connect AR/VR */}
        <Box 
            //backgroundColor="darkcyan"
            backgroundColor={theme.palette.neutral.light}
            borderRadius="20px"
            boxShadow="0px 0px 13px 0px rgba(96,125,139,0.89)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="300px"
            gridColumn="span 1"
        >
            <Button 
                variant="contained" 
                startIcon={<AddCircleOutlineIcon />} 
                color="success" 
                size='large'
                sx={{
                    width: "15em",
                    fontSize: "15px",
                    fontWeight: "bold",
                    height: "4em",
                    borderRadius: "20px",
                    color: theme.palette.mode == "dark" ? theme.palette.neutral.dark:  theme.palette.neutral.light,
                    backgroundColor: theme.palette.mode == "dark" ? theme.palette.secondary.dark: theme.palette.secondary.main,
                    transition: 'transform 0.1s ease-in',
                    "&:hover": {
                        color: theme.palette.neutral.light,
                        backgroundColor: theme.palette.secondary.light, // Change to the desired hover color
                        transform: 'scale(1.1)'
                    }
                }}
            >
                Connect to AR/VR
            </Button>
        </Box>

        {/* Video Box */}
        <Box 
            //backgroundColor="darkcyan"
            backgroundColor={theme.palette.neutral.light}
            borderRadius="20px"
            boxShadow="0px 0px 13px 0px rgba(96,125,139,0.89)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="300px"
            gridColumn="span 1"
        >
            <Button 
                variant="contained" 
                startIcon={<SwitchVideoIcon />} 
                color="success" 
                size='large'
                sx={{
                    width: "20em",
                    fontSize: "15px",
                    fontWeight: "bold",
                    height: "4em",
                    borderRadius: "20px",
                    color: theme.palette.mode == "dark" ? theme.palette.neutral.dark:  theme.palette.neutral.light,
                    backgroundColor: theme.palette.mode == "dark" ? theme.palette.secondary.dark: theme.palette.secondary.main,
                    transition: 'transform 0.1s ease-in',
                    "&:hover": {
                        color: theme.palette.neutral.light,
                        backgroundColor: theme.palette.secondary.light, // Change to the desired hover color
                        transform: 'scale(1.1)'
                    }
                }}
            >
                Switch To Live Video
            </Button>
        </Box>

        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            message={Object.keys(liveNotification).length !== 0 && liveNotification.message}
            key={vertical + horizontal}
            sx={{
                "& .MuiSnackbarContent-root":{
                    backgroundColor: theme.palette.secondary.light,
                },
                "& .MuiSnackbarContent-message" : {
                    fontSize: '1.3em',
                    fontWeight: 'bold',
                    color: theme.palette.neutral.light
                }
            }}
        />

        <style>
          {`.liveNotifContainer::-webkit-scrollbar-thumb {
                border-radius: 5px;
                background-color: ${theme.palette.secondary.main};
            }`}
      </style>
    </Box>
  )
}

export default TrackingDrone