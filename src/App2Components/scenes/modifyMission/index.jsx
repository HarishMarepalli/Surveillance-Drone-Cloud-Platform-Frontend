import React, {useState, useEffect} from "react";
import axios from "axios";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography, useTheme, CircularProgress  } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useParams } from 'react-router-dom';
import { parseISO } from 'date-fns';
import { BASE_URL, API_ENDPOINTS } from '../../../config';

const defInitialValues = {
    MissionId: "M001",
    MissionName: "Hello",
    MissionDescription: "",
    StartDateTime: null,
    EndDateTime: null,
    MissionType: "",
    Drone: "",
};

const checkoutSchema = yup.object().shape({
    MissionId: yup.string().required("Required"),
    MissionName: yup.string().required("Required"),
    MissionDescription: yup.string(),
    StartDateTime: yup.date().required("Start time is required"),
    EndDateTime: yup.date().required("End time is required"),
    MissionType: yup.string().required("Required"),
});

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

const ModifyMission = () => {
    const { missionId } = useParams();
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [droneServiceTypes, setDroneServiceTypes] = useState([]);
  const [missionForPlanner, setMissionForPlanner] = useState({});
  const [initialValues, setInitialValues] = useState(defInitialValues);
  const [fetched, setFetched] = useState(false);
  const navigate = useNavigate();
    const [availableDrones, setAvailableDrones] = useState([]);
    const [selectedDrone, setSelectedDrone] = useState('');
    const userdetails = JSON.parse(window.sessionStorage.getItem("userdetails"));
    const tenantId = userdetails.email;
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

    useEffect(() => {
        const fetchMissionForPlanner = async () => {
            try {
                const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.getOneMissionForPlanner}`, {
                    params: {
                    missionId: missionId
                    }
                });
                // console.log(response.data);
                setMissionForPlanner(response.data);
                //setLoading(false);
            } catch (error) {
                console.error('Error fetching drone service types:', error);
                //setLoading(false);
            }
        };

        fetchMissionForPlanner();
    }, []);

    // Update initialValues after fetching the mission data
    useEffect(() => {
        if (Object.keys(missionForPlanner).length > 0) {
            const curInitialValues = {
                MissionId: missionForPlanner.mission_id || "",
                MissionName: missionForPlanner.mission_name || "",
                MissionDescription: missionForPlanner.mission_description || "",
                StartDateTime: missionForPlanner.mission_start_time ? parseISO(missionForPlanner.mission_start_time) : null,
                EndDateTime: missionForPlanner.mission_end_time ? parseISO(missionForPlanner.mission_end_time) : null,
                MissionType: missionForPlanner.service_type || "",
                Drone: missionForPlanner.drone_id,
            };
            setInitialValues(curInitialValues);
            const dronesForMission = droneServiceTypes.filter(
                (mission) => mission.Drone_service_type.includes(missionForPlanner.service_type)
            );
            setAvailableDrones(dronesForMission);
            setFetched(true);
        }
    }, [missionForPlanner]);

    const handleMissionTypeChange = (selectedMissionType) => {
        const dronesForMission = droneServiceTypes.filter(
            (mission) => mission.Drone_service_type.includes(selectedMissionType)
        );
        setAvailableDrones(dronesForMission);
    };

    const handleDroneChange = (selectedDroneID) => {
        // Handle drone selection logic if needed
        setSelectedDrone(selectedDroneID);
    };

    const handleFormSubmit = (values) => {
        // console.log('Submitted Mission Details:', values);
        //navigate('/dashboard/missionPlanner');
        //navigate('/dashboard/missionPlanner', { state: { mission_type: values.MissionType, drone_id: values.Drone , user_id: tenantId, missionId} });
        navigate('/dashboard/missionPlanner', { state: { 
            mission_type: values.MissionType, 
            drone_id: values.Drone , 
            user_id: tenantId, 
            missionId: values.MissionId,
            mission_name: values.MissionName,
            mission_description: values.MissionDescription,
            mission_start_time: values.StartDateTime,
            mission_end_time: values.EndDateTime
        } 
        });
    };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box m="20px">
                <Header title={`Modify Mission - ${missionId.substring(0,8)}...`} />
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
                    {
                        fetched ?
                        ( 
                        
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
                                        <TextField
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
                                            disabled={true}
                                        />
                                        <br />
                                        
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
                                                value={values.Drone}
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
                                                Modify Waypoints
                                            </Button>
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                        
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
            </Box>
            <style>
                {`.MuiMultiSectionDigitalClock-root::-webkit-scrollbar-thumb {
                border-radius: 5px;
                background-color: ${theme.palette.secondary.main};
            }`}
            </style>
        </LocalizationProvider>
  )
}

export default ModifyMission