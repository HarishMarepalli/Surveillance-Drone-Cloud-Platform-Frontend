import React, {useEffect, useState} from 'react'
import axios from "axios";
import PropertyValueCard from '../../components/PropertyValueCard';
import { Box, Button, Typography, useTheme, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Checkbox, Snackbar, TextField,
    MenuItem, InputBase, lighten } from "@mui/material";
import debounce from 'lodash/debounce'; // Import debounce from lodash
import { BASE_URL, API_ENDPOINTS } from '../../../config';

const TrackingConfiguration = () => {
    const theme = useTheme();
    const [maxWidth, setMaxWidth] = React.useState('md');
    const [fullWidth, setFullWidth] = React.useState(true);
    const [scroll, setScroll] = React.useState('paper');
    const [userMissions,setUserMissions]=useState([]);
    const [selectedMissionId, setSelectedMissionId] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState(false);
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
    const [missionConfig, setMissionConfig] = useState(defaultConfig);
    const [filterOption, setFilterOption] = useState('MissionId');
    const [filterValue, setFilterValue] = useState('');

    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));

    const getAllMissionsForGivenUser = async ()=>{
        const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getAllMissionsForGivenUser}`,{
            params: {
                userId: userdetails.email
            }
        });
        // console.log(res.data);
        return res.data;
    }

    useEffect(() => {
        async function fetchData() {
            const basicMissionDtlsForUser = await getAllMissionsForGivenUser();
            //console.log(basicMissionDtlsFromDroneID);
            setUserMissions(basicMissionDtlsForUser);
        }
        fetchData();
    }, []);

    // Debouncing function using lodash debounce
    const handleFilterValueChangeDebounced = debounce((value) => {
        setFilterValue(value);
    }, 100);

    const handleFilterValueChange = (value) => {
        handleFilterValueChangeDebounced(value);
    };

    // const handleConfigureTracking = (missionId) => {
    //     setSelectedMissionId(missionId);
    //     setOpenDialog(true);
    //     console.log(selectedMissionId);
    // };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSaveConfiguration = async () => {
        try {
          await axios.post(`${BASE_URL}${API_ENDPOINTS.configureTracking}`, {
            missionId: selectedMissionId,
            config: missionConfig,
          });
          setOpenDialog(false);
          setOpenSnackbar(true);
          setSnackbarMsg("Configuration For Mission-"+ selectedMissionId + " Saved Successfully");
        } catch (error) {
          console.error('Error:', error);
          setOpenSnackbar(true);
          setSnackbarMsg("Error Occurred While Saving");
        }
    };

    const handleConfigureTracking = async (missionId) => {
        setOpenDialog(true);
        setSelectedMissionId(missionId);
        //console.log(selectedMissionId);
        try {
          const {config} = await getMissionTrackingConfig(missionId);
          //console.log(config);
          setMissionConfig(config);
        } catch (error) {
          //console.error('Error:', error);
          setMissionConfig(defaultConfig); // Reset config to default if error occurs
        }
    };

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

    const handleMasterCheckboxChange = (type, checked) => {
        const updatedConfig = { ...missionConfig };
        Object.keys(updatedConfig[type]).forEach(param => {
          updatedConfig[type][param] = checked;
        });
        setMissionConfig(updatedConfig);
    };
    
    const handleCheckboxChange = (category, parameter, checked) => {
        setMissionConfig((prevConfig) => ({
          ...prevConfig,
          [category]: {
            ...prevConfig[category],
            [parameter]: checked,
          },
        }));
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenSnackbar(false);
    };

    const renderTrackingBoxes = () => {
        return Object.entries(missionConfig).map(([type, params]) => (
            <Box 
                key={type} 
                mb={2}
                sx={{
                    "& .MuiCheckbox-root.Mui-checked": {
                        color: theme.palette.secondary.light,
                    },
                    ".parentCheckbox .MuiSvgIcon-fontSizeMedium":{
                        width: '1.4em',
                        height: '1.4em'
                    }
                }}
            >
                <Box>
                    <FormControlLabel
                        control={<Checkbox className='parentCheckbox' checked={Object.values(params).every(param => param)} onChange={(e) => handleMasterCheckboxChange(type, e.target.checked)} />}
                        label={<Typography sx={{ color: theme.palette.neutral.dark, fontWeight: 'bold', fontSize: '1.5em' }}>{`${type.charAt(0).toUpperCase() + type.slice(1)} Tracking`}</Typography>}
                    />
                </Box>
                <Box
                    display="grid"
                    gridTemplateColumns="1fr 1fr 1fr"
                >
                    {Object.entries(params).map(([param, isChecked]) => (
                    <FormControlLabel
                        key={param}
                        control={<Checkbox checked={isChecked} onChange={(e) => handleCheckboxChange(type, param, e.target.checked)} />}
                        label={<Typography sx={{ color: theme.palette.secondary.light, fontSize: '1.1em' }}>{param.charAt(0).toUpperCase() + param.slice(1)}</Typography>}
                        gridcolumn="span 1"
                    />
                    ))}
                </Box>
            </Box>
        ));
    };

  return (
    <>
        <Typography
            variant="h3"
            fontWeight="bold"
            // sx={{ color: colors.grey[900] }}
            color={theme.palette.neutral.dark}
            textAlign="center"
            my='20px'
        >
            Customize Tracking Parameters
        </Typography>
        <Box 
            display="flex" 
            alignItems="center" 
            padding="1em"
            sx={{
                "& .MuiInputLabel-formControl":{
                    color: theme.palette.secondary.light,
                    fontSize: "15px"
                },
                "& .MuiInputLabel-formControl.Mui-focused":{
                    color: theme.palette.secondary.light,
                    fontSize: "20px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.secondary.light
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.secondary.light
                }
            }}
        >
            <Box 
                mr={2}
            >
                <TextField
                    select
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                    label="Filter By"
                    size="medium"
                    variant="outlined"
                >
                    {['MissionId', 'MissionLocation', 'MissionType'].map((option) => (
                        <MenuItem style={{fontSize: '16px'}} key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
            <TextField
                value={filterValue}
                onChange={(e) => handleFilterValueChange(e.target.value)} // Using debounced function
                label="Search"
                size="medium"
                variant="outlined"
            />
        </Box>
            <Box
                display="grid"
                gridTemplateColumns="repeat(6, 1fr)"
                gridAutoRows="300px"
                gap="30px"
                //border="1px solid #aaa"
                marginRight='1em'
                //marginTop='1em'
                padding="1em"
                borderRadius="20px"
                mb="50px"
                //boxShadow="5px 8px 10px 0px rgba(96,125,139,0.89)"
                //backgroundColor={theme.palette.neutral.light}
            >
                
                {
                userMissions
                .filter((mission) => {
                    if (filterOption === 'MissionId') return mission.mission_id.includes(filterValue);
                    if (filterOption === 'MissionLocation') return mission.mission_location.includes(filterValue);
                    if (filterOption === 'MissionType') return mission.mission_type.includes(filterValue);
                    return false;
                })
                .map((data) => (
                    <Box 
                        gridColumn="span 2" 
                        key={data.mission_id}
                        backgroundColor={theme.palette.neutral.light}
                        borderRadius="20px"
                        boxShadow="0px 0px 13px 0px rgba(96,125,139,0.89)"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Box 
                            display="grid"
                            padding="1em"
                            margin="1em"
                            gap="30px"
                            gridTemplateColumns="1fr 1fr"
                        >
                            <PropertyValueCard property="Mission ID" value={data.mission_id.substring(0,8)+"..."} color={theme.palette.neutral.dark}/>
                            <PropertyValueCard property="Mission Type" value={data.mission_type} color={theme.palette.neutral.dark}/>
                            <PropertyValueCard property="Mission Location" value={data.mission_location} color={theme.palette.neutral.dark}/>
                            <PropertyValueCard property="Mission Distance(m)" value={data.mission_distance.toFixed(2)} color={theme.palette.neutral.dark}/>
                        </Box>
                        <Box 
                            display="flex" 
                            gridColumn="span 4" 
                            justifyContent="center" 
                            marginTop='20px'
                            >
                            <Button 
                                color="success" 
                                variant="contained"
                                size="medium" 
                                sx={{
                                height:'3em', 
                                textTransform:'none', 
                                fontSize:'15px',
                                color: theme.palette.mode == "dark" ? theme.palette.neutral.dark:  theme.palette.neutral.light,
                                backgroundColor: theme.palette.mode == "dark" ? theme.palette.secondary.dark: theme.palette.secondary.main,
                                transition: 'transform 0.1s ease-in',
                                "&:hover": {
                                    color: theme.palette.neutral.light,
                                    backgroundColor: theme.palette.secondary.light, // Change to the desired hover color
                                    transform: 'scale(1.1)'
                                }
                                }}
                                onClick={()=>handleConfigureTracking(data.mission_id)}
                            >
                                Configure Tracking
                            </Button>
                        </Box>
                    </Box>
                ))}

                <Dialog 
                    open={openDialog} 
                    onClose={handleCloseDialog}
                    maxWidth={maxWidth}
                    fullWidth={fullWidth}
                    scroll={scroll}
                >
                    <DialogTitle fontSize='1.7em' fontWeight='bold'>Configure Tracking for Mission {selectedMissionId}</DialogTitle>
                    <div className='configureDialogContainer'>
                        <DialogContent>
                            
                                {renderTrackingBoxes()}
                            
                        {/* Similar checkboxes for other categories: iot, health, velocity, position */}
                        </DialogContent>
                    </div>
                    <DialogActions>
                        {/* <Button onClick={handleCloseDialog}>Cancel</Button> */}
                        {/* <Button onClick={handleSaveConfiguration}>Save</Button> */}
                        <Button 
                            //color={theme.palette.secondary.main} 
                            variant="contained" 
                            size="large" 
                            onClick={handleSaveConfiguration}
                            sx={{
                                color: theme.palette.neutral.light,
                                backgroundColor: theme.palette.secondary.main,
                                "&:hover": {
                                    color: theme.palette.neutral.light,
                                    backgroundColor: theme.palette.secondary.light, // Change to the desired hover color
                                }
                            }}
                        >
                            Save
                        </Button>
                        <Button 
                            //color={theme.palette.secondary.main} 
                            variant="contained" 
                            size="large" 
                            onClick={handleCloseDialog}
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
                    </DialogActions>
                </Dialog>
                <Snackbar
                    open={openSnackbar}
                    anchorOrigin={{vertical:'bottom', horizontal: 'center'}}
                    autoHideDuration={5000}
                    onClose={handleCloseSnackbar}
                    message={snackbarMsg}
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
            </Box>
            <style>
                {`.configureDialogContainer::-webkit-scrollbar-thumb {
                border-radius: 5px;
                background-color: ${theme.palette.secondary.main};
            }`}
            </style>
       
    </>
  )
}

export default TrackingConfiguration