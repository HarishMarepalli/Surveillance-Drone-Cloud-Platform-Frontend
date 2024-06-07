import React, {useState, useEffect} from "react";
import axios from "axios";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from "@mui/material";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import TenantIdSingleton from "../../components/TenantId";
import * as yup from "yup";


function CreateMission() {
    const [serviceType, setServiceType] = useState('Campus Perimeter Patrol');
    const [drones, setDrones] = useState([]);
    const [selectedDrone, setSelectedDrone] = useState('');
    const navigate = useNavigate();
    const userdetails = JSON.parse(window.sessionStorage.getItem("userdetails"));
    const tenantId = userdetails.email;
    const missionId = ""; // means to create a mission, if the mission planner is lauched from modify a mission, the missionId will have value
  
    useEffect(() => {
      const fetchDrones = async () => {
        // Placeholder for fetching drone data based on serviceType
        // Replace this with actual backend communication
        const droneMapping = {
          'Campus Perimeter Patrol': ["Drone001", "Drone002", "Drone005", "Drone009"],
          'Crowd Monitoring': ["Drone003", "Drone007"],
          'Building Inspection': ["Drone004", "Drone008"],
          'Emergency response': ["Drone006", "Drone010"],
          'Parking Lot Surveillance': ["Drone011", "Drone012"],
          // Add other mappings as necessary
        };
        setDrones(droneMapping[serviceType] || []);
        setSelectedDrone(droneMapping[serviceType] ? droneMapping[serviceType][0] : '');
      };
  
      fetchDrones();
    }, [serviceType]);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      navigate('/dashboard/missionPlanner', { state: { serviceType, droneId: selectedDrone , tenantId, missionId} });
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Service Type:
          <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
            <option value="Campus Perimeter Patrol">Campus Perimeter Patrol</option>
            <option value="Crowd Monitoring">Crowd Monitoring</option>
            <option value="Building Inspection">Building Inspection</option>
            <option value="Emergency response">Emergency response</option>
            <option value="Parking Lot Surveillance">Parking Lot Surveillance</option>
          </select>
        </label>
        <br />
        <label>
          Drone ID:
          <select value={selectedDrone} onChange={(e) => setSelectedDrone(e.target.value)}>
            {drones.map(drone => (
              <option key={drone} value={drone}>{drone}</option>
            ))}
          </select>
        </label>
        <br />
        <input type="submit" value="Create Mission" />
      </form>
    );
}

export default CreateMission;