import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from "@mui/material";
import axios from 'axios';
import { Box } from "@mui/material";
import { Formik } from "formik";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import TenantIdSingleton from '../../components/TenantId';
import Map1 from '../ggleMapRender/Map1';
import * as yup from "yup";
import { BASE_URL, API_ENDPOINTS } from '../../../config';

function TrackDrone() {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ lat: null, lng: null });
  const userdetails = JSON.parse(window.sessionStorage.getItem("userdetails"));
  const TenantId = userdetails.email;
  const [droneOptions, setDroneOptions] = useState([]);

  const [inputData, setInputData] = useState({
    TenantId: TenantId,
    Name: "",
    Address: "",
    Lat: 0,
    Long: 0
  });

  const [path, setPath] = useState([]);

  const coordinatesList = [
    { lat: 37.33479344057956, lng: -121.88332385250544 },
    { lat: 37.33484382415231, lng: -121.88303417393183 },
    { lat: 37.33498804361024, lng: -121.88274449535822 },
    { lat: 37.335200506891354, lng: -121.88249773212885 },
    { lat: 37.335497334999936, lng: -121.88257098197937 },
    { lat: 37.33577804041586, lng: -121.88249588012695 },
    { lat: 37.33602462313035, lng: -121.88269972801208 },
    { lat: 37.33617737071936, lng: -121.88292503356934 },
    { lat: 37.33622775336385, lng: -121.88313961029053 },
    { lat: 37.336600354511, lng: -121.88320041512712 },
    { lat: 37.33668515715471, lng: -121.88334309845354 },
    { lat: 37.336650236067136, lng: -121.88360059051897},
    { lat: 37.33659825426545, lng: -121.88382589607622 },
    { lat: 37.33641831698184, lng: -121.88390099792863 },
    { lat: 37.33617013611007, lng: -121.88393318443681 },
    { lat: 37.335930484844475, lng: -121.88394391327287 },
    { lat: 37.335699363266734, lng: -121.88390099792863 },
    { lat: 37.33538293614714, lng: -121.88386881142046 },
    // Add more coordinates as needed
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      const { lat, lng } = coordinatesList[index];
      setInputData(prev => ({
        ...prev,
        Lat: lat,
        Long: lng
      }));
      setLocation({ lat, lng });
      setPath(prevPath => [...prevPath, { lat, lng }]);
      index = (index + 1) % coordinatesList.length;
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleChange = (e) => {
    setInputData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
      console.error("Error fetching mission options:", error);
      return [];
    }
  };

  const sendRequest = async () => {
    await axios.post(`${BASE_URL}${API_ENDPOINTS.addMap}`, {
      TenantId: inputData.TenantId,
      Name: inputData.Name,
      Address: inputData.Address,
      Lat: location.lat,
      Long: location.lng
    })
      .then((res) => {
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputData);
    sendRequest().then(() => alert("Added map successfully!!"));
    console.log(inputData.TenantId);
    //.then(() => navigate("/dashboard"));
  };

    
    return (
        <Box m="20px">
            <Header title="Track Drone" />
                <Formik 
                onSubmit={handleSubmit}
                initialValues={initialValues}
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
                        <Map1 location={location} setLocation={setLocation} path={path} />
                    </form>
                    )}
                </Formik>
        </Box>
    )
};
const checkoutSchema = yup.object().shape({
    DroneId: yup.string().required("required"),
  });
  const initialValues = {
    DroneId: "",
  };

export default TrackDrone;