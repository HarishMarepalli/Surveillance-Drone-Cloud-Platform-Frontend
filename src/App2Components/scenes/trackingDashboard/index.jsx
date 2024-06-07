import { Box, Button, Typography, useTheme } from "@mui/material";
import * as React from 'react';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import MapBoxBasic from "../../components/MapBoxBasic";
import DroneCard from "../../components/DroneCard";
import DroneStatus from "../../components/DroneStatus";
import StatusLegend from "../../components/StatusLegend";
import DroneStatisticsCard from "../../components/DroneStatisticsCard";
import LiveNotificationCard from '../../components/LiveNotificationCard';
import axios from "axios";
import { useEffect,useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions,CircularProgress } from "@mui/material";
import Slide from '@mui/material/Slide';
import TrackMissionDialog from "../trackMissionDialog";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogBox from "../../components/DialogBox";
import { BASE_URL, API_ENDPOINTS } from '../../../config';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TrackingDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [visibleDronesCnt, setVisibleDronesCnt] = useState(0);
  const [visibleDrones, setVisibleDrones] = useState([]);
  const [selectedDroneFromMap, setSelectedDroneFromMap] = useState(null);
  const [maxWidth, setMaxWidth] = React.useState('xl');
  const [fullWidth, setFullWidth] = React.useState(true);
  const [scroll, setScroll] = React.useState('paper');
  const [droneCount, setDroneCount] = useState(0);
  const [droneCounts, setDroneCounts] = useState({
    active: 0,
    connected: 0,
    stopped: 0,
    repair: 0,
    charging: 0
  });

  const handleMarkerClick = (droneId) => {
    setSelectedDroneFromMap(droneId);
  };

  const handleCloseDialog = () => {
    setSelectedDroneFromMap(null);
  };

  const droneSummary = {
    "total_drones": "31",
    "total_missions": "45",
    "total_trips": "279",
    "total_flight_hours": "1000",
    "drone_counts": {
      "active": "15",
      "connected": "4",
      "stopped": "9",
      "repair": "3",
      "charging": "1"
    }
  }

  const initGeoJSON = {
    'type': 'geojson',
    'data': {
        'type': 'FeatureCollection',
        'features': []
    }
  };

const mockdrones = {
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
          },
          {
            'id': 1,
              'type': 'Feature',
              'properties': {
                'name': 'DJI Mini SE',
                'status': 'Connected',
                'message': 'Bar',
                'iconSize': [75, 75],
                'imgUrl': '/images/drone3.png',
                'description': "<strong>Drone 0</strong><p class='desc'>Amazon - Palo Alto Office</p>"
              },
              'geometry': {
                  'type': 'Point',
                  'coordinates': [-122.1653283, 37.4444932]
              }
          },
          {
            'id': 2,
              'type': 'Feature',
              'properties': {
                'name': 'DJI Phantom',
                'status': 'Stopped',
                'message': 'Baz',
                'iconSize': [75, 75],
                'imgUrl': '/images/drone3.png',
                'description': "<strong>Drone 2</strong><p class='desc'>San Jose Mineta International Airport</p>"
              },
              'geometry': {
                  'type': 'Point',
                  'coordinates': [-121.9340348, 37.3640414]
              }
          },
          {
            'id':3,
            'type': 'Feature',
            'properties': {
              'name': 'DJI Mini SE',
              'status': 'Repair',
              'message': 'Baz',
              'iconSize': [75, 75],
              'imgUrl': '/images/drone1.png',
              'description': "<strong>Drone 3</strong><p class='desc'>Adobe HeadQuarters - San Jose</p>"
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-121.8970849, 37.3305728]
            }
        },
        {
          'id': 4,
          'type': 'Feature',
          'properties': {
            'name': 'DJI Phantom',
            'status': 'Connected',
            'message': 'Baz',
            'iconSize': [75, 75],
            'imgUrl': '/images/drone3.png',
            'description': "<strong>Drone 4</strong><p class='desc'>Tesla - Fremont Campus</p>"
          },
          'geometry': {
              'type': 'Point',
              'coordinates': [-121.9495679, 37.4924727]
          }
      },
      {
        'id': 5,
        'type': 'Feature',
        'properties': {
          'name': 'DJI Mini SE',
          'status': 'Stopped',
          'message': 'Baz',
          'iconSize': [75, 75],
          'imgUrl': '/images/drone1.png',
          'description': "<strong>Drone 5</strong><p class='desc'>Apple - Cupertino Campus</p>"
        },
        'geometry': {
            'type': 'Point',
            'coordinates': [-122.0115469, 37.334648]
        }
      },
      {
        'id': 6,
        'type': 'Feature',
        'properties': {
          'name': 'DJI Mini SE',
          'status': 'Active',
          'message': 'Baz',
          'iconSize': [75, 75],
          'imgUrl': '/images/drone1.png',
          'description': "<strong>Drone 6</strong><p class='desc'>Meta - Sunnyvale Campus</p>"
        },
        'geometry': {
            'type': 'Point',
            'coordinates': [-122.0913736, 37.3347602]
        }
      }
      ]
  }
}

const scrollBarStyles = {
  WebkitScrollbar: {
    height: '7px',
    width: '7px',
  },
  WebkitScrollbarTrack: {
    borderRadius: '5px',
    backgroundColor: '#A0A8A9',
  },
  WebkitScrollbarTrackHover: {
    backgroundColor: '#A0A8A9',
  },
  WebkitScrollbarTrackActive: {
    backgroundColor: '#B8C0C2',
  },
  WebkitScrollbarThumb: {
    borderRadius: '5px',
    backgroundColor: '#DE3ACA',
  },
  WebkitScrollbarThumbHover: {
    backgroundColor: '#62A34B',
  },
  WebkitScrollbarThumbActive: {
    backgroundColor: '#62A34B',
  }
};

  const [usercount,setusercount]=useState(0);
  const [dronecount,setdronecount]=useState(0);
  const [missioncount,setmissioncount]=useState(0);
  

  //Saiteja
  const [dronesForMap, setDronesForMap] = useState([]);
  const [formattedDronesForMap, setFormattedDronesForMap] = useState(initGeoJSON);
  const [missions,setMissions]=useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [currentMissions, setCurrentMissions] = useState([]);
  // const [missions, setMissions] = useState([]);
  const [totalMissions, setTotalMissions] = useState(0);
  const [inProgressMissionsCount, setInProgressMissionsCount] = useState(0);
  const [totalCameraActions, setTotalCameraActions] = useState(0);
  const [statusZero, setStatusZero] = useState(true);

  let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));

  const getDronesForMap = async ()=>{
    const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getAllDronesPerUserForMap}`, {
      params: {
        userId: userdetails.email
      }
    });
    //console.log(res.data);
    return res.data;
  }

  const getMissionsFromDroneID = async ()=>{
    //const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getMissionsForUser}` + selectedDroneFromMap);
    const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getMissionsForUser}`, {
      params: {
        droneId: selectedDroneFromMap,
        userId: userdetails.email
      }
    });
    //console.log(res.data);
    return res.data;
  }

  const getRecentNotifications = async ()=>{
    const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getRecentNotifications}`, {
      params: {
        userId: userdetails.email
      }
    });
    //console.log(res.data);
    return res.data;
  }

  const getAllDrones = async ()=>{
    const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getAllDrones}`);
    //console.log(res.data);
    return res.data;
  }

  const getAllMissionsForGivenUser = async ()=>{
    const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getAllMissionsForGivenUser}/`,{
        params: {
            userId: userdetails.email
        }
    });
    //console.log(res.data);
    return res.data;
  }

  const sendRequest = async () => {
    const res = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.countDrones}`
    );
    //console.log('Data received from backend:', res.data);
    return res.data;
  };

  const sendRequest1 = async () => {
    const res = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.countUsers}`
    );
    //console.log('Data received from backend:', res.data);
    return res.data;
  };

  const sendRequest2 = async () => {
    const res = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.countMissions}`
    );
    //console.log('Data received from backend:', res.data);
    return res.data;
  };

  
  // let userdetails = {
  //   role: "student",
  //   firstname: "Saiteja",
  //   lastname: "Goruganthu",
  //   email: "tirumalasaiteja.goruganthu@sjsu.edu"
  // }
  const TenantId=userdetails.email;

  const sendRequest3 = async () => {
    const res = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.getAllMissionPlans}/${TenantId}`
    );
    //console.log('Data received from backendmission:', res.data);
    return res.data;
  };

  useEffect(() => {
    async function fetchData() {
      // const data = await sendRequest();
      // const data1= await sendRequest1();
      // const data2= await sendRequest2();

      //Saiteja
      const droneDataForMap = await getDronesForMap();
      setDronesForMap(droneDataForMap);
      const formattedDataForMap = convertToGeoJSON(droneDataForMap);
      setFormattedDronesForMap(formattedDataForMap);
      //console.log(droneDataForMap);

      const recentNotif = await getRecentNotifications();
      setRecentNotifications(recentNotif);

      const allDrones = await getAllDrones();
      setDroneCount(allDrones.length);
      // Initialize count variables
      let activeCount = 0;
      let connectedCount = 0;
      let stoppedCount = 0;
      let repairCount = 0;
      let chargingCount = 0;

      // Iterate over each drone and count based on last_known_status
      allDrones.forEach(drone => {
        switch (drone.last_known_status.toLowerCase()) {
          case 'active':
            activeCount++;
            break;
          case 'connected':
            connectedCount++;
            break;
          case 'stopped':
            stoppedCount++;
            break;
          case 'repair':
            repairCount++;
            break;
          case 'charging':
            chargingCount++;
            break;
          default:
            break;
        }
      });

      const isAllStatusZero = areAllValuesZero({
        active: activeCount,
        connected: connectedCount,
        stopped: stoppedCount,
        repair: repairCount,
        charging: chargingCount
      });
      console.log(isAllStatusZero);
      if(!isAllStatusZero)
      {
        setStatusZero(false);
      }

      // Update state with the counts
      setDroneCounts({
        active: activeCount,
        connected: connectedCount,
        stopped: stoppedCount,
        repair: repairCount,
        charging: chargingCount
      });


      const fetchedMissions = await getAllMissionsForGivenUser();
      //console.log(basicMissionDtlsFromDroneID);
      setCurrentMissions(fetchedMissions);

      // Count all missions
      setTotalMissions(fetchedMissions.length);

      // Calculate the number of "In Progress" missions
      const inProgressMissionsCount1 = fetchedMissions.reduce((totalCount, mission) => {
        if (mission.mission_status === 'In Progress') {
            return totalCount + 1;
        } else {
            return totalCount;
        }
      }, 0);
      setInProgressMissionsCount(inProgressMissionsCount1);

      // Function to calculate the total number of camera actions in completed missions
      const calculateTotalCameraActions = () => {
        let totalCameraActions = 0;

        // Iterate over each completed mission
        fetchedMissions.forEach(mission => {
            if (mission.mission_status === 'Completed') {
                // Iterate over each mission waypoint
                mission.mission_waypoints.forEach(waypoint => {
                    const cameraAction = waypoint.camera_actions;
                    if (cameraAction === 1 || cameraAction === 2 || cameraAction === 3) {
                        totalCameraActions++;
                    }
                });
            }
        });

        return totalCameraActions;
      };

      // Call the function to calculate total camera actions
      const totalCameraActions1 = calculateTotalCameraActions();
      setTotalCameraActions(totalCameraActions1);

      setChartLoading(false);
      // setdronecount(data);
      // setusercount(data1);
      // setmissioncount(data2);
    }
    fetchData();
  }, []);

  //Saiteja
  useEffect(() => {
    async function fetchData() {
      const basicMissionDtlsFromDroneID = await getMissionsFromDroneID();
      //console.log(basicMissionDtlsFromDroneID);
      setMissions(basicMissionDtlsFromDroneID);
    }
    fetchData();
  }, [selectedDroneFromMap]);

  /* HELPER METHODS */
  function convertToGeoJSON(data) {
    return {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: data.map(drone => ({
          id: drone.drone_id,
          type: 'Feature',
          properties: {
            name: drone.name,
            status: drone.last_known_status,
            message: drone.mission_type,
            iconSize: [75, 75], // Adjust icon size as needed
            imgUrl: '/images/drone1.png', // Replace with actual image URL
            //description: `<strong>Drone-ID: ${drone.drone_id}</strong><p class='desc'>Mission-ID: ${drone.mission_id}</p><p class='desc'>${drone.mission_type}</p><p class='desc'>${drone.mission_location}</p>`
            description: `<strong>Drone-ID: ${drone.drone_id}</strong><p class='desc'>${drone.name}</p>`
          },
          geometry: {
            type: 'Point',
            coordinates: [drone.last_known_long, drone.last_known_lat]
          }
        }))
      }
    };
  }

  function areAllValuesZero(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] !== 0) {
                return false;
            }
        }
    }
    return true;
  }

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  return (
    <Box 
      m="20px" 
      display="grid" 
      gridTemplateColumns="2fr 1fr"
    >
      {/* HEADER */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb="30px"
        gridColumn="1/4"
      >
        <Header 
          title="Tracking Dashboard" 
          subtitle="Welcome to your tracking dashboard"
        />
      </Box>

      <Box 
        mb="30px"
        gridColumn="1/2"
      >
        <Typography 
          marginBottom="15px" 
          variant="h3"
          fontWeight="bold"
          // sx={{ color: colors.grey[900] }}
          color={theme.palette.neutral.dark}
          //textAlign="center"
        >
          Current Statistics
        </Typography>

        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(8, 1fr)"
          gridAutoRows="140px"
          gap="30px"
          marginBottom="30px"
          marginRight="30px"
        >
          {/* ROW 1 */}
          <Box
            gridColumn="span 2"
            //backgroundColor="chocolate"
            backgroundColor={theme.palette.secondary.main}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="20px"
            boxShadow="5px 8px 10px 0px rgba(96,125,139,0.89)"
          >
            {
              !chartLoading ? 
              (
                <DroneStatisticsCard
                  title = "Total Drones"
                  count = {droneCount}
                />
              ):
              (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress 
                        sx={{
                            color: theme.palette.neutral.light
                        }}
                    />
                </Box>
              )
            }
          </Box>

          <Box
            gridColumn="span 2"
            //backgroundColor="dodgerblue"
            backgroundColor={theme.palette.secondary.main}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="20px"
            boxShadow="5px 8px 10px 0px rgba(96,125,139,0.89)"
          >
            {
              !chartLoading ? 
              (
                <DroneStatisticsCard
                  title = "Total Ongoing Missions"
                  count = {inProgressMissionsCount}
                />
              ):
              (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress 
                        sx={{
                          color: theme.palette.neutral.light
                        }}
                    />
                </Box>
              )
            }
          </Box>

          <Box
            gridColumn="span 2"
            //backgroundColor="blueviolet"
            backgroundColor={theme.palette.secondary.main}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="20px"
            boxShadow="5px 8px 10px 0px rgba(96,125,139,0.89)"
          >
            {
              !chartLoading ? 
              (
                <DroneStatisticsCard
                  title = "Total Trips Taken"
                  count = {totalMissions}
                />
              ):
              (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress 
                        sx={{
                          color: theme.palette.neutral.light
                        }}
                    />
                </Box>
              )
            }
          </Box>

          <Box
            gridColumn="span 2"
            //backgroundColor={colors.blueAccent[400]}
            backgroundColor={theme.palette.secondary.main}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="20px"
            boxShadow="5px 8px 10px 0px rgba(96,125,139,0.89)"
          >
            {
              !chartLoading ? 
              (
                <DroneStatisticsCard
                  title = "Total Camera Actions"
                  count = {totalCameraActions}
                />
              ):
              (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress 
                        sx={{
                          color: theme.palette.neutral.light
                        }}
                    />
                </Box>
              )
            }
          </Box>
        </Box>
      </Box>

      {/* Recent Notifications */}
      <Box
        mb="50px"
        gridColumn="2"
        border={theme.palette.mode == 'dark' ? `1px solid ${theme.palette.neutral.dark}`: 'none'}
        mx="2em"
        marginRight="0px"
        padding="1em"
        paddingTop="2em"
        borderRadius="20px"
        gridRow="2/4"
        boxShadow="5px 8px 10px 0px rgba(96,125,139,0.89)"
        backgroundColor={theme.palette.neutral.light}
      >
        <Typography 
          marginBottom="15px" 
          variant="h3"
          fontWeight="bold"
          // sx={{ color: colors.grey[900] }}
          color={theme.palette.neutral.dark}
          textAlign="center"
        >
          Recent Notifications
        </Typography>
        <div className="liveNotifContainer">
          {
            recentNotifications.length == 0 && <p>No Recent Notifications</p>
          }
          <LiveNotificationCard liveNotifications={recentNotifications} displayMissionDetails={true}/>
        </div>
      </Box>

      {/* Drone Status */}
      <Box
        gridColumn="1/2"
        border="1px solid #aaa"
        //mx="2em"
        padding="1em"
        borderRadius="20px"
        mb="50px"
        boxShadow="5px 8px 10px 0px rgba(96,125,139,0.89)"
        backgroundColor={theme.palette.neutral.light}
      >
        {
          !statusZero ? 
          (
            !chartLoading ? 
            (
              <DroneStatus statusData={droneCounts} />
            ):
            (
              <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                  <CircularProgress 
                      sx={{
                          color: theme.palette.secondary.main
                      }}
                  />
              </Box>
            )
          ):
          (
            <p style={{
              fontSize: "20px",
              fontWeight: "bold",
              textAlign:"center"
            }}>
              No drones assigned to you yet.
            </p>
          )
        }
      </Box>

      {/* Display Map */}
      <Box
        display="flex"
        gridColumn="1/4"
        backgroundColor={theme.palette.neutral.light}
        boxShadow="5px 8px 10px 0px rgba(96,125,139,0.89)"
        borderRadius="20px"
        padding="2em"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          width="70%"
        >
          <Box 
            width="100%" 
            m="0 30px" 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            marginBottom="1em"
            padding="1em"
            borderRight="1px solid #777"
          >
            <Typography 
              style={{flex: "1 0 75%"}} 
              variant="h3"
              fontWeight="bold"
              // sx={{ color: colors.grey[900] }}
              color={theme.palette.neutral.dark}
            >
              Drone Map
            </Typography>
            <Typography 
              style={{flex: "1 0 25%"}} 
              variant="h4"
              fontWeight="bold"
              // sx={{ color: colors.grey[900] }}
              color={theme.palette.neutral.dark}
              textAlign="end"
            >
              Search Drones By City
            </Typography>
          </Box>
          <Box width="100%" my="20px">
            <StatusLegend />
          </Box>
            <MapBoxBasic 
              trackdroneData = {formattedDronesForMap}
              countDrones = {setVisibleDronesCnt}
              listDrones = {setVisibleDrones}
              onMarkerClick={handleMarkerClick}
            />
        </Box>

        <Box width="-webkit-fill-available" overflow="auto">
          <Box 
            marginBottom="2em" 
            marginLeft="2em"
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Typography
                variant="h3"
                fontWeight="bold"
                // sx={{ color: colors.grey[900] }}
                color={theme.palette.neutral.dark}
            >
              Current Drones
            </Typography>
            <Typography
                variant="h5"
                sx={{ color: theme.palette.neutral.dark }}
                fontWeight="bold"
                marginTop="14px"
            >
              {visibleDronesCnt} Drone(s) Found
            </Typography>
          </Box>
          <Box className="trackDroneList" overflow="auto" maxHeight="900px">
          {
            visibleDronesCnt>0 ? formattedDronesForMap.data.features.filter((feature) => {
              const temp = 'marker' + feature.id;
              return visibleDrones.includes(temp)
            }).map((filteredDrone) => (
              
                <DroneCard 
                  key={filteredDrone.id}
                  filteredDrone = {filteredDrone}
                  onCardClick={handleMarkerClick}
                />
              
            )) : (
              <div style={{marginLeft: "2em", fontSize: "20px"}}>No Drones Found in this area</div>
            )
          }
          </Box>
        </Box>
      </Box>

      {/* Dialog */}
      {/* <Dialog 
        open={selectedDroneFromMap !== null} 
        TransitionComponent={Transition}
        keepMounted
        maxWidth= {maxWidth}
        fullWidth={fullWidth}
        scroll={scroll}
        onClose={handleCloseDialog}
      >
        <DialogTitle
          fontSize="26px"
          style={{color: '#000', padding: '24px'}}
        >
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            fontSize: 20,
            color: (theme) => theme.palette.grey[900],
          }}
        >
          <CloseIcon sx={{width: '1.5em', height:'1.5em'}} />
        </IconButton>
        <DialogContent>
          <TrackMissionDialog 
            missionsFromDroneID = {missions}
            selectedDroneFromMap = {selectedDroneFromMap}
            handleCloseDialog = {handleCloseDialog}
          />
        </DialogContent>
      </Dialog> */}
      <DialogBox 
        selectedDroneFromMap={selectedDroneFromMap}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        scroll={scroll}
        handleCloseDialog={handleCloseDialog}
      >
        <TrackMissionDialog 
          missionsFromDroneID = {missions}
          selectedDroneFromMap = {selectedDroneFromMap}
          handleCloseDialog = {handleCloseDialog}
        />
      </DialogBox>
      <style>
          {`.liveNotifContainer::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: ${theme.palette.secondary.main};
      }
      .trackDroneList::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: ${theme.palette.secondary.main};
      }`}
      </style>
    </Box>
  );
};

export default TrackingDashboard;
