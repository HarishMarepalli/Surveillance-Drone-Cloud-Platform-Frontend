import React, {useEffect, useState} from 'react'
import axios from "axios";
import Header from "../../components/Header";
import { Box, Button, Typography, useTheme, CircularProgress, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DroneStatisticsCard from "../../components/DroneStatisticsCard";
import MissionStatusChart from "../../components/MissionStatusChart";
import MissionTypeChart from "../../components/MissionTypeChart";
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import {useNavigate} from 'react-router-dom';
import { BASE_URL, API_ENDPOINTS } from '../../../config';

const MissionDashboard = ({setSelected}) => {
    const theme = useTheme();
    const [missions, setMissions] = useState([]);
    const [totalMissions, setTotalMissions] = useState(0);
    const [totalCompletedDistance, setTotalCompletedDistance] = useState(0);
    const [totalCompletedMissionHours, setTotalCompletedMissionHours] = useState(0);
    const [totalPlannedMissionHours, setTotalPlannedMissionHours] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentMissions, setCurrentMissions] = useState([]);
    const [missionStatusData, setMissionStatusData] = useState({});
    const [missionTypeData, setMissionTypeData] = useState({});
    const navigate = useNavigate();
  
    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));

    const getAllMissionsForGivenUser = async ()=>{
        const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getAllMissionsForGivenUser}/`,{
            params: {
                userId: userdetails.email
            }
        });
        //console.log(res.data);
        return res.data;
    }

    const handleCreateMissionClick = () => {
        setSelected('Create Mission');
        navigate('/dashboard/createMission');
    }

    const handleViewMissionsClick = () => {
        setSelected('View Missions');
        navigate('/dashboard/viewMissions');
    }

    const handleTrackMissionClick = (missionId, droneId) => {
        setSelected('Tracking Dashboard');
        navigate(`/tracking/${droneId}/mission/${missionId}`);
        window.location.reload();
    };

    useEffect(() => {
        async function fetchData() {
            const fetchedMissions = await getAllMissionsForGivenUser();
            //console.log(basicMissionDtlsFromDroneID);
            setMissions(fetchedMissions);

            // Count all missions
            setTotalMissions(fetchedMissions.length);

            // Calculate total distance covered in completed missions
            const completedMissionsDistance = fetchedMissions.reduce((totalDistance, mission) => {
            if (mission.mission_status === 'Completed') {
                return totalDistance + mission.mission_distance;
            } else {
                return totalDistance;
            }
            }, 0);
            setTotalCompletedDistance(completedMissionsDistance);

            // Calculate total completed mission hours
            const completedMissionHours = fetchedMissions.reduce((totalHours, mission) => {
            if (mission.mission_status === 'Completed') {
                const endTime = new Date(mission.mission_end_time);
                const startTime = new Date(mission.mission_start_time);
                const missionHours = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours
                return totalHours + missionHours;
            } else {
                return totalHours;
            }
            }, 0);
            setTotalCompletedMissionHours(completedMissionHours);

            // Calculate total planned mission hours
            const plannedMissionHours = fetchedMissions.reduce((totalHours, mission) => {
            if (mission.mission_status === 'Planned') {
                const endTime = new Date(mission.mission_end_time);
                const startTime = new Date(mission.mission_start_time);
                const missionHours = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours
                return totalHours + missionHours;
            } else {
                return totalHours;
            }
            }, 0);
            setTotalPlannedMissionHours(plannedMissionHours);

            // Count missions by status
            const statusCounts = {};
            fetchedMissions.forEach(mission => {
            statusCounts[mission.mission_status] = (statusCounts[mission.mission_status] || 0) + 1;
            });
            //console.log(statusCounts);
            setMissionStatusData(statusCounts);

            // Count missions by type
            const typeCounts = {};
            fetchedMissions.forEach(mission => {
            typeCounts[mission.mission_type] = (typeCounts[mission.mission_type] || 0) + 1;
            });
            // console.log(typeCounts);
            setMissionTypeData(typeCounts);

            //Get missions in-progress
            const missionsInProgress = fetchedMissions.filter(mission => mission.mission_status === 'In Progress');
            // console.log(missionsInProgress);
            setCurrentMissions(missionsInProgress);

            setLoading(false);
        }
        fetchData();
    }, []);

  return (
    // <div>
    //   <h2>Total Missions: {totalMissions}</h2>
    //   <h2>Total Completed Distance: {totalCompletedDistance.toFixed(2)} m</h2>
    //   <h2>Total Completed Mission Hours: {totalCompletedMissionHours} hours</h2>
    //   <h2>Total Planned Mission Hours: {totalPlannedMissionHours} hours</h2>
    // </div>
    <Box
        m="20px" 
        display="grid" 
        gridTemplateColumns="1fr 1fr 1fr 1fr"
        bgcolor={theme.palette.neutral.light}
        p="2em"
        borderRadius="20px"
        boxShadow="5px 8px 10px 0px rgba(96,125,139,0.89)"
    >
        {/* HEADER */}
        <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            mb="30px"
            gridColumn="1/2"
        >
            <Header 
            title="Mission Dashboard" 
            subtitle="Welcome to your mission dashboard"
            />
        </Box>

        {/* BUTTONS */}
        <Box 
            display="flex" 
            justifyContent="end" 
            alignItems="center" 
            mb="30px"
            gridColumn="2/5"
        >
            <Button 
                color="success" 
                variant="contained"
                size="medium" 
                sx={{
                    height:'3em', 
                    textTransform:'none', 
                    fontSize:'18px',
                    marginRight:'20px',
                    borderRadius:'15px',
                    color: theme.palette.mode == "dark" ? theme.palette.neutral.dark:  theme.palette.neutral.light,
                    backgroundColor: theme.palette.mode == "dark" ? theme.palette.secondary.dark: theme.palette.secondary.main,
                    transition: 'transform 0.1s ease-in',
                    "&:hover": {
                        color: theme.palette.neutral.light,
                        backgroundColor: theme.palette.secondary.light, // Change to the desired hover color
                        transform: 'scale(1.1)'
                    }
                }}
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleCreateMissionClick}
            >
                Create a Mission
            </Button>
            <Button 
                color="success" 
                variant="contained"
                size="medium" 
                sx={{
                    height:'3em', 
                    textTransform:'none', 
                    fontSize:'18px',
                    borderRadius:'15px',
                    color: theme.palette.mode == "dark" ? theme.palette.neutral.dark:  theme.palette.neutral.light,
                    backgroundColor: theme.palette.mode == "dark" ? theme.palette.secondary.dark: theme.palette.secondary.main,
                    transition: 'transform 0.1s ease-in',
                    "&:hover": {
                        color: theme.palette.neutral.light,
                        backgroundColor: theme.palette.secondary.light, // Change to the desired hover color
                        transform: 'scale(1.1)'
                    }
                }}
                startIcon={<VisibilityIcon />}
                onClick={handleViewMissionsClick}
            >
                View Your Missions
            </Button>
        </Box>

        {/* STATISTICS CARDS */}
        <Box 
            mb="30px"
            gridColumn="1/3"
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
            {
                !loading ? 
                (
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
                        <DroneStatisticsCard
                            title = "Total Missions"
                            count = {totalMissions}
                        />
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
                        <DroneStatisticsCard
                            title = "Total Distance Travelled"
                            count = {(totalCompletedDistance/1000).toFixed(2)+ ' km'}
                        />
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
                        <DroneStatisticsCard
                            title = "Total Completed Hours"
                            count = {totalCompletedMissionHours+ ' Hours'}
                        />
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
                        <DroneStatisticsCard
                        title = "Total Planned Hours"
                        count = {totalPlannedMissionHours + ' Hours'}
                        />
                    </Box>
                </Box>
                ) :
                (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress 
                            sx={{
                                color: theme.palette.secondary.main
                            }}
                        />
                    </Box>
                )
            }
        </Box>

        {/* CURRENT IN-PROGRESS MISSIONS */}
        <Box
            gridColumn="3/5"
            border="1px solid #777"
            boxShadow="5px 8px 10px 0px rgba(96,125,139,0.89)"
            borderRadius="20px"
            height="300px"
            padding="1em"
        >
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
                    Ongoing Missions
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ color: theme.palette.neutral.dark }}
                    fontWeight="bold"
                    marginTop="14px"
                >
                    {currentMissions.length} Mission(s) In-progress
                </Typography>
            </Box>
            <Box className="trackDroneList" overflow="auto" maxHeight="170px">
            {
                currentMissions.length>0 ? currentMissions.map((curMission) => (
                
                    // <DroneCard 
                    //     key={curMission.mission_id}
                    //     filteredDrone = {curMission}
                    //     onCardClick={handleMarkerClick}
                    // />

                    <Box
                        key={curMission.mission_id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderRadius="20px"
                        margin="10px 2em"
                        padding="1.3em"
                        backgroundColor={theme.palette.background.default}
                        border="1px solid #fff"
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                        >
                            <Typography 
                                color={theme.palette.neutral.dark} 
                                variant="h5"
                                
                            >
                                Mission ID #
                            </Typography>
                            <Typography 
                                color={theme.palette.neutral.dark} 
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
                                {curMission.mission_id}
                            </Typography>
                            <Typography color={theme.palette.neutral.dark} variant="h5">{curMission.mission_name}</Typography>
                            <Typography color={theme.palette.neutral.dark} variant="h5">{curMission.mission_type}</Typography>
                        </Box>
                        <Box>
                            <img 
                                src='/images/drone1.png' 
                                alt={curMission.mission_name}
                                width={75}
                                height={75} 
                                style={{
                                    filter: "drop-shadow(0 0 0.1rem #fff)",
                                    animation: "pulse 1s infinite alternate"
                                }}   
                            />
                        </Box>
                        <Box>
                            <Tooltip title="Track">
                                <Button 
                                    color="success" 
                                    variant="contained"
                                    size="medium" 
                                    sx={{
                                        height:'3em', 
                                        textTransform:'none', 
                                        fontSize:'18px',
                                        marginRight:'20px',
                                        borderRadius:'15px',
                                        color: theme.palette.mode == "dark" ? theme.palette.neutral.dark:  theme.palette.neutral.light,
                                        backgroundColor: theme.palette.mode == "dark" ? theme.palette.secondary.dark: theme.palette.secondary.main,
                                        transition: 'transform 0.1s ease-in',
                                        "&:hover": {
                                            color: theme.palette.neutral.light,
                                            backgroundColor: theme.palette.secondary.light, // Change to the desired hover color
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                    startIcon={<GpsFixedIcon />}
                                    onClick={()=>handleTrackMissionClick(curMission.mission_id, curMission.drone_id)}
                                >
                                    Track
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>
                
                )) : (
                <div style={{marginLeft: "2em", fontSize: "20px"}}>No Missions Found</div>
                )
            }
            </Box>
        </Box>

        {/* MISSION STATUS CHART */}
        <Box
            gridColumn="1/2"
            //mx="2em"
            padding="1em"
            borderRadius="20px"
            mb="50px"
            mt="20px"
        >
            <MissionStatusChart statusData={missionStatusData} />
        </Box>

        {/* MISSION TYPE CHART */}
        <Box
            gridColumn="2/5"
            //mx="2em"
            padding="1em"
            borderRadius="20px"
            mb="50px"
            mt="20px"
        >
            <MissionTypeChart data={missionTypeData} />
        </Box>
        
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

export default MissionDashboard