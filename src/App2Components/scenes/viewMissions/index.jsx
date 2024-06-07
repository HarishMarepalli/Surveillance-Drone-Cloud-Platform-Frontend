import React from 'react';
import { Box, Button, Chip, Typography, useTheme, IconButton, Tooltip } from "@mui/material";
import Header from "../../components/Header";
import MapBoxBasic from "../../components/MapBoxBasic";
import axios from "axios";
import { useEffect,useState } from "react";
import MissionStatusLegend from "../../components/MissionStatusLegend";
import PropertyValueCard1 from '../../components/PropertyValueCard1';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {useNavigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { BASE_URL, API_ENDPOINTS } from '../../../config';

const initGeoJSON = {
    'type': 'geojson',
    'data': {
        'type': 'FeatureCollection',
        'features': []
    }
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const missionStatusColors = {
    "Completed": '#4caf50',     // Green color for Completed status
    "Planned": '#ff9800',    // Orange color for Planned status
    "In Progress": '#FFD700',
    "Failed": '#f44336',     // Red color for Failed status
};

const ViewMissions = () => {
    const theme = useTheme();
    const [userMissions,setUserMissions]=useState([]);
    const [formattedMissionsForMap, setFormattedMissionsForMap] = useState(initGeoJSON);
    const [visibleMissionsCnt, setVisibleMissionsCnt] = useState(0);
    const [visibleMissions, setVisibleMissions] = useState([]);
    //const [selectedDroneFromMap, setSelectedDroneFromMap] = useState(null);
    const [expanded, setExpanded] = React.useState('');
    const [lng, setLng] = useState(-121.8836464);
    const [lat, setLat] = useState(37.3351916);
    const [state, setState] = React.useState({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
      });
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState('');
    const [selectedMission, setSelectedMission] = React.useState('');
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('md');
    const { vertical, horizontal, open } = state;
    const navigate = useNavigate();
    const location = useLocation();
    const extraInfo = location.state ? location.state.extraInfo : null;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setState({ ...state, open: false });
    };

    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));

    const handleMarkerClick = (missionId) => {
        setExpanded(missionId);
    };

    const getAllMissionsForGivenUser = async ()=>{
        const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getAllMissionsForGivenUser}`,{
            params: {
                userId: userdetails.email
            }
        });
        //console.log(res.data);
        return res.data;
    }

    const deleteMissionForUser = async (missionId)=>{
        const res = await axios.delete(`${BASE_URL}${API_ENDPOINTS.deleteMissionForUser}`, {
          params: {
            userId: userdetails.email,
            missionId
          }
        });
        //console.log(res.data);
        return res.data;
      }

      const deleteConfigurationForMission = async (missionId)=>{
        const res = await axios.delete(`${BASE_URL}${API_ENDPOINTS.deleteConfigurationForMission}`, {
          params: {
            missionId
          }
        });
        //console.log(res.data);
        return res.data;
      }

      const deleteNotificationsForMission = async (missionId)=>{
        const res = await axios.delete(`${BASE_URL}${API_ENDPOINTS.deleteNotificationsForMission}`, {
          params: {
            missionId
          }
        });
        //console.log(res.data);
        return res.data;
      }

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleExpandIconClick = (event, panel) => {
        // Prevent the event from propagating to the parent accordion summary
        event.stopPropagation();
        
        // Toggle the accordion state
        setExpanded(expanded === panel ? null : panel);
    };

    const handleDeleteClick = (event, missionId) => {
        // Prevent the event from propagating to the parent accordion summary
        event.stopPropagation();
        setSelectedMission(missionId);
        handleDialogOpen();

        //console.log(missionId);
    }

    const performDeletion = async () => {
        const msg = await deleteMissionForUser(selectedMission);
        const msg1 = await deleteConfigurationForMission(selectedMission);
        const msg2 = await deleteNotificationsForMission(selectedMission);
        // console.log(msg);
        setSnackbarMsg(msg.message);
        setState({ ...state, open: true });

        if(msg.deleted)
        // Update the formattedMissionsForMap state
        setFormattedMissionsForMap(prevState => {
            // Filter out the deleted mission from the features array
            const updatedFeatures = prevState.data.features.filter(feature => feature.id !== selectedMission);
            // Return the updated state
            return { ...prevState, data: { ...prevState.data, features: updatedFeatures } };
        });

        handleDialogClose();
    }

    const handleEditClick = (event, missionId) => {
        // Prevent the event from propagating to the parent accordion summary
        event.stopPropagation();

        // console.log(missionId);
        navigate(`/editMission/${missionId}`);
        //window.location.reload();
    }

    // Function to get the color based on status
    const getColorForStatus = (status) => {
        //console.log(status);
        return missionStatusColors[status] || '#000000'; // Default to black if status is not found
    };

    useEffect(() => {
        async function fetchData() {
            const basicMissionDtlsForUser = await getAllMissionsForGivenUser();
            //console.log(basicMissionDtlsFromDroneID);
            setUserMissions(basicMissionDtlsForUser);
            const formattedDataForMap = convertToGeoJSON(basicMissionDtlsForUser);
            setFormattedMissionsForMap(formattedDataForMap);
        }
        fetchData();
    }, []);

    useEffect(() => {
        // console.log('Hello');
        // setSnackbarMsg("Mission Created/Updated Successfully");
        // setState({ ...state, open: true });
        // console.log(location.state);
        if (location.state && location.state.extraInfo) {
            setSnackbarMsg(location.state.extraInfo);
            setState({ ...state, open: true });
            location.state=null;
        }
    }, []);

    /* HELPER METHODS */
  function convertToGeoJSON(data) {
    return {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: data.map(mission => ({
          id: mission.mission_id,
          type: 'Feature',
          properties: {
            name: mission.mission_location,
            status: mission.mission_status,
            message: mission.mission_description,
            type: mission.mission_type,
            start: mission.mission_start_time,
            end: mission.mission_end_time,
            distance: mission.mission_distance,
            drone: mission.drone_id,
            iconSize: [75, 75], // Adjust icon size as needed
            imgUrl: '/images/drone1.png', // Replace with actual image URL
            //description: `<strong>Drone-ID: ${drone.drone_id}</strong><p class='desc'>Mission-ID: ${drone.mission_id}</p><p class='desc'>${drone.mission_type}</p><p class='desc'>${drone.mission_location}</p>`
            description: `<p class='missionIdClass'>${mission.mission_id}</p><p class='desc'>${mission.mission_type}</p><p class='desc'>${mission.mission_location}</p>`
          },
          geometry: {
            type: 'Point',
            coordinates: [mission.mission_waypoints[0].longitude, mission.mission_waypoints[0].latitude]
          }
        }))
      }
    };
  }

  const formatMongoDate = (mongoDate) => {
    const date = new Date(mongoDate);
    //console.log(date);
    const options = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = date.toLocaleDateString('en-US', options);
    //console.log(formattedDate);
    const timezoneOffset = date.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2];
    //console.log(timezoneOffset);
    return `${formattedDate}, ${timezoneOffset}`;
    };
  return (
    <Box m="20px">
        <Header title="View Missions" />
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
                Mission Map
                </Typography>
                <Typography 
                style={{flex: "1 0 25%"}} 
                variant="h4"
                fontWeight="bold"
                // sx={{ color: colors.grey[900] }}
                color={theme.palette.neutral.dark}
                textAlign="end"
                >
                Search Missions By City
                </Typography>
            </Box>
            <Box width="100%" my="20px">
                <MissionStatusLegend />
            </Box>
                <MapBoxBasic 
                    trackdroneData = {formattedMissionsForMap}
                    countDrones = {setVisibleMissionsCnt}
                    listDrones = {setVisibleMissions}
                    onMarkerClick={handleMarkerClick}
                    longitude={lng}
                    latitude={lat}
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
                Current Missions
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ color: theme.palette.neutral.dark }}
                    fontWeight="bold"
                    marginTop="14px"
                >
                {visibleMissionsCnt} Mission(s) Found
                </Typography>
            </Box>
            <Box className="trackDroneList" overflow="auto" maxHeight="900px">
            {
                visibleMissionsCnt>0 ? formattedMissionsForMap.data.features.filter((feature) => {
                const temp = 'marker' + feature.id;
                return visibleMissions.includes(temp)
                }).map((filteredMission) => (
                
                    // <DroneCard 
                    // key={filteredDrone.id}
                    // filteredDrone = {filteredDrone}
                    // onCardClick={handleMarkerClick}
                    // />
                    //<div>{filteredMission.id}</div>
                    <Box
                        display="flex"
                        justifyContent="space-around"
                        alignItems="center"
                        borderRadius="20px"
                        margin="1em"
                        marginRight="0px"
                        padding="1em"
                        key={filteredMission.id}
                        //backgroundColor={theme.palette.background.default}
                        //border="1px solid #fff"
                        //sx={{cursor: 'pointer'}}
                    >
                        <Accordion 
                            expanded={expanded === filteredMission.id} 
                            onChange={handleChange(filteredMission.id)}
                            sx={{
                                //backgroundColor: 'darkorchid',
                                backgroundColor:theme.palette.secondary.main,
                                //margin: '20px !important', 
                                borderRadius: '20px !important',
                                "& .MuiAccordionSummary-expandIconWrapper": {
                                    color: theme.palette.neutral.light
                                }
                            }}
                            
                        >
                            <AccordionSummary 
                                expandIcon={
                                    <>
                                    {
                                        (expanded !== filteredMission.id) && 
                                        <Tooltip title="Expand">
                                            <VisibilityIcon onClick={(event) => handleExpandIconClick(event, filteredMission.id)}/>
                                        </Tooltip>
                                    }
                                        {
                                        (expanded === filteredMission.id) && 
                                        <Tooltip title="Collapse">
                                            <VisibilityOffIcon onClick={(event) => handleExpandIconClick(event, filteredMission.id)}/>
                                        </Tooltip>
                                        }
                                    </>
                                } 
                                aria-controls="location-content" 
                                id="location-header"
                                sx={{
                                    "& .MuiAccordionSummary-content":{
                                        alignItems:"center",
                                        justifyContent:"space-between"
                                    }
                                }}
                            >
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                >
                                    <Typography 
                                        color={theme.palette.neutral.light} 
                                        variant="h5"
                                       
                                    >
                                        Mission ID #
                                    </Typography>
                                    <Typography 
                                        color={theme.palette.neutral.light} 
                                        variant="h4" 
                                        fontWeight="bold"
                                        sx={{
                                            marginBottom: '10px',
                                            width: "150px",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis"
                                        }}
                                    >
                                        {filteredMission.id}
                                    </Typography>
                                {expanded !== filteredMission.id && 
                                    <Typography color={theme.palette.neutral.light} variant="h5">{filteredMission.properties.name}</Typography>
                                }
                                {expanded !== filteredMission.id && 
                                    <Typography color={theme.palette.neutral.light} variant="h5">{filteredMission.properties.type}</Typography>
                                }
                                </Box>
                                <Box>
                                    <Chip 
                                        label={filteredMission.properties.status}
                                        // color={
                                        //     filteredDrone.properties.status === 'Active' ? 'success' : 
                                        //     filteredDrone.properties.status === 'Connected' ? 'warning' : 
                                        //     filteredDrone.properties.status === 'Stopped' ? '#f00' : 'error'
                                        // }
                                        style={{
                                            height: "40px", 
                                            width: "8em", 
                                            fontSize: "14px", 
                                            fontWeight: "bold", 
                                            color: (filteredMission.properties.status === 'Failed' ||
                                                filteredMission.properties.status === 'In Progress' ||
                                                filteredMission.properties.status === 'Planned') ? '#000' : '#fff', 
                                            backgroundColor: getColorForStatus(filteredMission.properties.status)
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Tooltip title="Edit">
                                        <IconButton 
                                            aria-label="Edit"
                                            sx={{
                                                color: theme.palette.mode == 'light' ? "#fff" : "#000"
                                            }}
                                            onClick={(e) => handleEditClick(e, filteredMission.id)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton 
                                            aria-label="delete"
                                            sx={{
                                                color: theme.palette.mode == 'light' ? "#fff" : "#000",
                                                marginRight:"10px"
                                            }}
                                            onClick={(e) => handleDeleteClick(e, filteredMission.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    display:"grid",
                                    padding:"0em",
                                    margin:"2em",
                                    gap:"30px",
                                    gridTemplateColumns:"1fr 1fr"
                                }}
                            >
                                <PropertyValueCard1 
                                    color={theme.palette.neutral.light}
                                    property="Mission Type" 
                                    value={filteredMission.properties.type}
                                />
                                <PropertyValueCard1
                                    color={theme.palette.neutral.light} 
                                    property="Mission Location" 
                                    value={filteredMission.properties.name}
                                />
                                <PropertyValueCard1
                                    color={theme.palette.neutral.light}
                                    property="Mission Distance" 
                                    value={filteredMission.properties.distance.toFixed(2)}
                                />
                                <PropertyValueCard1
                                    color={theme.palette.neutral.light}
                                    property="Assigned Drone" 
                                    value={filteredMission.properties.drone}
                                />
                                <PropertyValueCard1
                                    color={theme.palette.neutral.light}
                                    property="Mission Description" 
                                    value={filteredMission.properties.message}
                                />
                                <PropertyValueCard1
                                    color={theme.palette.neutral.light}
                                    property="Mission Start Time" 
                                    value={formatMongoDate(filteredMission.properties.start)}
                                />
                                <PropertyValueCard1
                                    color={theme.palette.neutral.light}
                                    property="Mission End Time" 
                                    value={formatMongoDate(filteredMission.properties.end)}
                                />
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                
                )) : (
                <div style={{marginLeft: "2em", fontSize: "20px"}}>No Missions Found in this area</div>
                )
            }
            </Box>
        </Box>
      </Box>
      <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            message={snackbarMsg}
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
        <Dialog
            open={dialogOpen}
            TransitionComponent={Transition}
            keepMounted
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            onClose={handleDialogClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{
                "& .MuiDialog-paper": {
                    padding: "1em"
                },
                "& .MuiDialogTitle-root": {
                    fontSize: "25px"
                },
                "& .MuiDialogContentText-root": {
                    fontSize: "18px"
                }
            }}
        >
            <DialogTitle>{`Are you sure you want to delete this mission (ID: ${selectedMission})?`}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                This is a irrevertible operation. You can't undo this action.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button 
                variant="contained"  
                size="large" 
                onClick={handleDialogClose}
                sx={{
                    color: theme.palette.neutral.light,
                    backgroundColor: theme.palette.secondary.main,
                    "&:hover": {
                        color: theme.palette.neutral.light,
                        backgroundColor: theme.palette.secondary.light, // Change to the desired hover color
                    }
                }}
            >
                Cancel
            </Button>
            <Button 
                variant="contained"  
                size="large" 
                onClick={performDeletion}
                sx={{
                    color: theme.palette.neutral.light,
                    backgroundColor: theme.palette.secondary.main,
                    "&:hover": {
                        color: theme.palette.neutral.light,
                        backgroundColor: theme.palette.secondary.light, // Change to the desired hover color
                    }
                }}
            >
                Yes
            </Button>
            </DialogActions>
        </Dialog>
      <style>
        {`
        .trackDroneList::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background-color: ${theme.palette.secondary.main};
          }
        `}
      </style>
    </Box>
  )
}

export default ViewMissions