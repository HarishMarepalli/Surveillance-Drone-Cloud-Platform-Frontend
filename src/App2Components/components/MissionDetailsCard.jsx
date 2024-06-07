import { Box, Typography, Button, useTheme } from '@mui/material';
import PropertyValueCard from './PropertyValueCard';
import { useEffect,useState } from "react";
import axios from "axios";
import React from 'react'
import DialogBox from "./DialogBox";
import TrackMissionDialog from "../scenes/trackMissionDialog";
import { BASE_URL, API_ENDPOINTS } from '../../config';

const MissionDetailsCard = ({data, selectedDroneId}) => {
    //console.log(data);
  const theme = useTheme();
  const [selectedDroneFromMap, setSelectedDroneFromMap] = useState(null);
  const [missions,setMissions]=useState([]);
  const [maxWidth, setMaxWidth] = React.useState('xl');
  const [fullWidth, setFullWidth] = React.useState(true);
  const [scroll, setScroll] = React.useState('paper');

  let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));

  const getMissionsFromDroneID = async ()=>{
    //console.log(data);
    const res = await axios.get(`${BASE_URL}${API_ENDPOINTS.getMissionsForUser}/`, {
      params: {
        droneId: selectedDroneFromMap,
        userId: userdetails.email
      }
    });
    return res.data;
  }

  const handleChangeMissionClick = () => {
    setSelectedDroneFromMap(selectedDroneId);
  };

  const handleCloseDialog = () => {
    setSelectedDroneFromMap(null);
  };
    //Saiteja
  useEffect(() => {
    async function fetchData() {
      const basicMissionDtlsFromDroneID = await getMissionsFromDroneID();
      //console.log(basicMissionDtlsFromDroneID);
      setMissions(basicMissionDtlsFromDroneID);
    }
    fetchData();
  }, [selectedDroneFromMap]);

  return (
    <Box>
      <Box 
        display="grid"
        padding="1em"
        margin="1em"
        gap="30px"
        gridTemplateColumns="1fr 1fr"
      >
          <PropertyValueCard color={theme.palette.neutral.dark} property="Mission ID" value={data.mission_id}/>
          <PropertyValueCard color={theme.palette.neutral.dark} property="Mission Type" value={data.mission_type}/>
          <PropertyValueCard color={theme.palette.neutral.dark} property="Mission Location" value={data.mission_location}/>
          <PropertyValueCard color={theme.palette.neutral.dark} property="Mission Distance(m)" value={data.mission_distance.toFixed(2)}/>
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
            onClick={()=>handleChangeMissionClick()}
          >
              Track Another Mission
          </Button>
        </Box>
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
            // setSelectedMissionID={setSelectedMissionID}
          />
      </DialogBox>
    </Box>
    
  )
}

export default MissionDetailsCard