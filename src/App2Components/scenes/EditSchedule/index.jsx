import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DesktopDateTimePicker } from '@mui/x-date-pickers';
import { parseISO, format } from 'date-fns';
import { BASE_URL, API_ENDPOINTS } from '../../../config';


const EditSchedule = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [missionOptions, setMissionOptions] = useState([]);
  const [droneOptions, setDroneOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const schedule_info = location.state.schedule_info;
  
  const initialValues = {
    ScheduledId: schedule_info.schedule_id,
    StartTime: new Date(schedule_info.start_time),
    EndTime: new Date(schedule_info.end_time),
    MissionId: schedule_info.mission_id,
    DroneId: schedule_info.drone_id,
  };
  
  useEffect(() => {
    fetchMissionOptions().then((options) => setMissionOptions(options));
  }, []);

  const fetchMissionOptions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.fetchMissionOptions}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching mission options:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchDroneOptions().then((options) => setDroneOptions(options));
  }, []);

  const fetchDroneOptions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.fetchDroneOptions}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching drone options:", error);
      return [];
    }
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    updateRequest(values).then(() => navigate("/dashboard/viewSchedular"));
  };

  const updateRequest = async (values) => {
    console.log("coming to update request")
    const res = await axios.put(`${BASE_URL}${API_ENDPOINTS.getSchedules}/${values.ScheduledId}`, {
      schedule_id: values.ScheduledId,
      start_time: values.StartTime,
      end_time: values.EndTime,
      mission_id: values.MissionId,
      drone_id: values.DroneId,
    }, { withCredentials: true }).catch(err => console.log(err))
    const data = await res.data;
    return data;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Box m="20px">
      <Header title="Edit Drone" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues} // Replace with the fetched drone data
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
            <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Schedule ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ScheduledId}
                name="ScheduledId"
                error={!!touched.ScheduledId && !!errors.ScheduledId}
                helperText={touched.ScheduledId && errors.ScheduledId}
                sx={{ gridColumn: "span 4" }}
                InputProps={{ readOnly: true }}
              />
              <DesktopDateTimePicker
                fullWidth
                ampm={false}
                format="yyyy/MM/dd HH:mm:ss"
                label="Start Time"
                value={values.StartTime}
                onChange={(value) => handleChange({ target: { name: "StartTime", value } })}
                renderInput={(params) => (
                  <TextField {...params} helperText={touched.StartTime && errors.StartTime} error={!!touched.StartTime && !!errors.StartTime} />
                )}
              />
              <DesktopDateTimePicker
                fullWidth
                ampm={false}
                format="yyyy/MM/dd HH:mm:ss"
                label="End Time"
                value={values.EndTime}
                onChange={(value) => handleChange({ target: { name: "EndTime", value } })}
                renderInput={(params) => (
                  <TextField {...params} helperText={touched.EndTime && errors.EndTime} error={!!touched.EndTime && !!errors.EndTime} />
                )}
              />

              <FormControl
                fullWidth
                variant="filled"
                error={!!touched.MissionId && !!errors.MissionId}
                sx={{ gridColumn: "span 4" }}
              >
                <InputLabel htmlFor="MissionId">Mission ID</InputLabel>
                <Select
                  label="Mission ID"
                  value={values.MissionId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  inputProps={{
                    name: "MissionId",
                    id: "MissionId",
                  }}
                >
                  {missionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {touched.MissionId && errors.MissionId}
                </FormHelperText>
              </FormControl>
              <FormControl
                fullWidth
                variant="filled"
                error={!!touched.DroneId && !!errors.DroneId}
                sx={{ gridColumn: "span 4" }}
              >
                <InputLabel htmlFor="DroneId">Drone ID</InputLabel>
                <Select
                  label="Drone ID"
                  value={values.DroneId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  inputProps={{
                    name: "DroneId",
                    id: "DroneId",
                  }}
                >
                  {droneOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {touched.DroneId && errors.DroneId}
                </FormHelperText>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Drone
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
    </LocalizationProvider>
  );
};

const checkoutSchema = yup.object().shape({
  ScheduledId: yup.string().required("required"),
  StartTime: yup.string().required("required"),
  EndTime: yup.string().required("required"),
  MissionId: yup.string().required("required"),
  DroneId: yup.string().required("required"),
});


export default EditSchedule;
