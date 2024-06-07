import React, {useState, useEffect} from "react";
import axios from "axios";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { transform } from "lodash";
import { useHistory } from 'react-router-dom';
import { BASE_URL, API_ENDPOINTS } from '../../../config';

function CreateMission() {
const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [droneServiceTypes, setDroneServiceTypes] = useState([]);
  //const history = useHistory();

  useEffect(() => {
    const fetchDroneServiceTypes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.getServiceTypesForAllDrones}`);
            setDroneServiceTypes(response.data);
            //setLoading(false);
        } catch (error) {
            console.error('Error fetching drone service types:', error);
            //setLoading(false);
        }
    };

    fetchDroneServiceTypes();
}, []);
  
    const missionOptions = [
        // { value: '', label: '' },
        { value: 'Campus Perimeter Patrol', label: 'Campus Perimeter Patrol' },
        { value: 'Crowd Monitoring', label: 'Crowd Monitoring' },
        { value: 'Building Inspection', label: 'Building Inspection' },
        { value: 'Emergency response', label: 'Emergency response' },
        { value: 'Parking Lot Surveillance', label: 'Parking Lot Surveillance' },
        { value: 'Fire Monitoring', label: 'Fire Monitoring' },
        { value: 'Agriculture', label: 'Agriculture' },
        { value: 'Traffic Control', label: 'Traffic Control' },
        { value: 'Infrastructure Inspection', label: 'Infrastructure Inspection' },
        { value: 'Powerline Inspection', label: 'Powerline Inspection' },
        { value: 'Search and Rescue', label: 'Search and Rescue' },
        { value: 'Industrial Site Monitoring', label: 'Industrial Site Monitoring' },
    ];

    // const createmissiondata = [
    //     {
    //         Drone_id: "D001",
    //         Drone_service_type: ["Parking Lot Surveillance", "Agriculture", "Traffic Control", "Building Inspection"]
    //     },
    //     {
    //         Drone_id: "D002",
    //         Drone_service_type: ["Agriculture", "Fire Monitoring", "Emergency response"]
    //     },
    //     {
    //         Drone_id: "D003",
    //         Drone_service_type: ["Crowd Monitoring", "Infrastructure Inspection", "Powerline Inspection"]
    //     },
    //     {
    //         Drone_id: "D004",
    //         Drone_service_type: ["Infrastructure Inspection", "Building Inspection", "Industrial Site Monitoring", "Campus Perimeter Patrol"]
    //     },
    //     {
    //         Drone_id: "D005",
    //         Drone_service_type: ["Infrastructure Inspection", "Building Inspection", "Search and Rescue"]
    //     },
    //     {
    //         Drone_id: "D006",
    //         Drone_service_type: ["Crowd Monitoring", "Parking Lot Surveillance", "Traffic Control", "Campus Perimeter Patrol"]
    //     },
    //     {
    //         Drone_id: "D007",
    //         Drone_service_type: ["Fire Monitoring", "Search and Rescue", "Emergency response"]
    //     },
    //     {
    //         Drone_id: "D008",
    //         Drone_service_type: ["Powerline Inspection", "Industrial Site Monitoring", "Agriculture"]
    //     },
    //     {
    //         Drone_id: "D009",
    //         Drone_service_type: ["Crowd Monitoring", "Parking Lot Surveillance", "Search and Rescue"]
    //     },
    //     {
    //         Drone_id: "D010",
    //         Drone_service_type: ["Crowd Monitoring", "Emergency response", "Agriculture", "Campus Perimeter Patrol"]
    //     },
    // ];

    // const dummySchedules = [
    //     {
    //       drone_id: "D001",
    //       start_time: "2024-04-26T10:00:00Z",
    //       end_time: "2024-04-26T11:00:00Z",
    //       schedule_id: "S001"
    //     },
    //     {
    //       drone_id: "D001",
    //       start_time: "2024-04-27T17:00:00Z",
    //       end_time: "2024-04-27T19:00:00Z",
    //       schedule_id: "S002"
    //     }
    // ];

    // const shouldDisableDateTime = (dateTime) => {
    //     console.log(dateTime);
    //     const selectedDateTime = new Date(dateTime);

    //     // Check if the selectedDateTime falls within any schedule
    //     for (const schedule of dummySchedules) {
    //         if(schedule.drone_id === selectedDrone)
    //         {
    //             const startTime = new Date(schedule.start_time);
    //             const endTime = new Date(schedule.end_time);
    //             if (selectedDateTime >= startTime && selectedDateTime <= endTime) {
    //                 console.log("Hello");
    //                 return true; // Disable the selectedDateTime
    //             }
    //         }
    //     }
    //     console.log("Hi");
    //     return false; // Enable the selectedDateTime
    // };

    const navigate = useNavigate();
    const [availableDrones, setAvailableDrones] = useState([]);
    const [selectedDrone, setSelectedDrone] = useState('');
    const userdetails = JSON.parse(window.sessionStorage.getItem("userdetails"));
    const tenantId = userdetails.email;
    const missionId = ""; // means to create a mission, if the mission planner is lauched from modify a mission, the missionId will have value

    const handleDroneChange = (selectedDroneID) => {
        // Handle drone selection logic if needed
        setSelectedDrone(selectedDroneID);
    };

    const handleMissionTypeChange = (selectedMissionType) => {
        const dronesForMission = droneServiceTypes.filter(
            (mission) => mission.Drone_service_type.includes(selectedMissionType)
        );
        setAvailableDrones(dronesForMission);
    };

    const handleFormSubmit = (values) => {
        // console.log('Submitted Mission Details:', values);
        //navigate('/dashboard/missionPlanner');
        //navigate('/dashboard/missionPlanner', { state: { mission_type: values.MissionType, drone_id: values.Drone , user_id: tenantId, missionId} });
        navigate('/dashboard/missionPlanner', { state: { 
            mission_type: values.MissionType, 
            drone_id: values.Drone , 
            user_id: tenantId, 
            missionId: '',
            mission_name: values.MissionName,
            mission_description: values.MissionDescription,
            mission_start_time: values.StartDateTime,
            mission_end_time: values.EndDateTime
        } });
    };

    const checkoutSchema = yup.object().shape({
        // MissionId: yup.string().required("Required"),
        MissionName: yup.string().required("Required"),
        MissionDescription: yup.string(),
        StartDateTime: yup.date().required("Start time is required"),
        EndDateTime: yup.date().required("End time is required"),
        MissionType: yup.string().required("Required"),
    });

    const initialValues = {
        // MissionId: "",
        MissionName: "",
        MissionDescription: "",
        StartDateTime: null,
        EndDateTime: null,
        MissionType: "",
        Drone: [],
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box m="20px">
                <Header title="Create New Mission" />
                <Box
                    width="50%"
                    margin="auto"
                    backgroundColor={theme.palette.neutral.light}
                    padding="2em"
                    borderRadius="20px"
                    boxShadow="0px 0px 13px 0px rgba(96,125,139,0.89)"
                    sx={{
                        "& .MuiInputLabel-root": {
                            color: theme.palette.neutral.dark,
                            fontSize: "1.2rem",
                        },
                        "& .Mui-focused.MuiInputLabel-root": {
                            color: theme.palette.neutral.dark,
                            fontWeight: "bold"
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.mode == "light" ? colors.grey[200] : colors.grey[800]
                        },
                        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.neutral.dark
                        },
                        "& .MuiOutlinedInput-root":{
                            fontSize: "1.2rem"
                        },
                        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: '#ddd'
                        }
                    }}
                >
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
                        validationSchema={checkoutSchema}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            setFieldValue,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <FormControl className="form-control" fullWidth>
                                {/* <label htmlFor="MissionId">Mission ID</label> */}
                                {/* <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    label="Mission ID"
                                    name="MissionId"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.MissionId}
                                    error={touched.MissionId && Boolean(errors.MissionId)}
                                    helperText={touched.MissionId && errors.MissionId}
                                />
                                <br /> */}
                                
                                {/* <label htmlFor="MissionId">Mission Name</label> */}
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    label="Mission Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.MissionName}
                                    name="MissionName"
                                    error={!!touched.MissionName && !!errors.MissionName}
                                    helperText={touched.MissionName && errors.MissionName}
                                    sx={{ marginBottom: "20px" }}
                                />
                                {/* <label htmlFor="MissionId">Mission Description</label> */}
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    label="Mission Description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.MissionDescription}
                                    name="MissionDescription"
                                    multiline
                                    rows={6}
                                    sx={{ marginBottom: "20px" }}
                                />
                                <FormControl className="form-control" 
                                    fullWidth
                                    variant="outlined"
                                    error={!!touched.MissionType && !!errors.MissionType}
                                    sx={{ marginBottom: "20px" }}
                                >
                                    {/* <label htmlFor="MissionType">Mission Type</label> */}
                                    <InputLabel htmlFor="MissionType">Mission Type</InputLabel>
                                    
                                    <Select
                                        label="Select Mission Type"
                                        value={values.MissionType}
                                        onChange={(e) => {
                                            handleChange(e);
                                            handleMissionTypeChange(e.target.value);
                                        }}
                                        onBlur={handleBlur}
                                        inputProps={{
                                            name: "MissionType",
                                            id: "MissionType",
                                        }}
                                    >
                                        {missionOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>
                                        {touched.MissionType && errors.MissionType}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl className="form-control"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ marginBottom: "20px" }}
                                >
                                    <InputLabel htmlFor="DroneList">Available Drones</InputLabel>
                                    <Select
                                        label="Select from Available Drones"
                                        value={values.Drone || []}
                                        onChange={(e)=> {
                                            handleChange(e)
                                            handleDroneChange(e.target.value);
                                        }}
                                        onBlur={handleBlur}
                                        inputProps={{
                                            name: "Drone",
                                            id: "DroneList",
                                        }}
                                    >
                                        {availableDrones.map((drone) => (
                                            <MenuItem key={drone.Drone_id} value={drone.Drone_id}>
                                                {`Drone - ${drone.Drone_id}`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {/* <FormHelperText>
                                        Select drone for the mission
                                    </FormHelperText> */}
                                </FormControl>
                                <br />
                                {/* <label htmlFor="MissionId">Mission's Start Date and Time</label> */}
                                <DateTimePicker
                                    label="Start Date and Time for mission (PST)"
                                    value={values.StartDateTime}
                                    disablePast={true}
                                    onChange={(newValue) => {
                                        setFieldValue("StartDateTime", newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            variant="filled"
                                            error={!!touched.StartDateTime && !!errors.StartDateTime}
                                            helperText={touched.StartDateTime && errors.StartDateTime}
                                            sx={{ marginBottom: "20px" }}
                                        />
                                    )}
                                    // shouldDisableDateTime={shouldDisableDateTime}
                                />
                                <br />
                                {/* <label htmlFor="MissionId">Mission's End Date and Time</label> */}
                                <DateTimePicker
                                    label="End Date and Time for mission (PST)"
                                    value={values.EndDateTime}
                                    disablePast={true}
                                    onChange={(newValue) => {
                                        setFieldValue("EndDateTime", newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            variant="filled"
                                            error={!!touched.EndDateTime && !!errors.EndDateTime}
                                            helperText={touched.EndDateTime && errors.EndDateTime}
                                            sx={{ marginBottom: "20px" }}
                                        />
                                    )}
                                    // shouldDisableDateTime={shouldDisableDateTime}
                                />
                                <br />
                                </FormControl>
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    marginTop="1em"
                                    sx={{
                                        "& .MuiButton-root": {
                                            transition: "transform ease-in 0.1s"
                                        },
                                        "& .MuiButton-root:hover":{
                                            backgroundColor: theme.palette.secondary.light,
                                            transform: "scale(1.1)"
                                        }
                                    }}
                                >
                                    <Button 
                                        type="submit" 
                                        className="button-submit" 
                                        color="secondary" 
                                        variant="contained"
                                        sx={{
                                            fontSize:"1rem",
                                            fontWeight:"bold",
                                            //borderRadius:"15px"
                                        }}
                                    >
                                        Set Waypoints
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Box>
            <style>
                {`.MuiMultiSectionDigitalClock-root::-webkit-scrollbar-thumb {
                border-radius: 5px;
                background-color: ${theme.palette.secondary.main};
            }`}
            </style>
        </LocalizationProvider>
    )
};

export default CreateMission;