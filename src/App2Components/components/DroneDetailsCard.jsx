import { Box, Typography, Button, useTheme } from '@mui/material';
import PropertyValueCard from './PropertyValueCard';
import {useNavigate} from 'react-router-dom';
import React from 'react'

const DroneDetailsCard = ({data}) => {
    //console.log(data);
    const theme = useTheme();
    const navigate = useNavigate();
    const handleChangeDroneClick = () => {
      navigate(`/tracking/dashboard`);
    };
  return (
    <Box 
        display="grid"
        padding="1em"
        gridTemplateColumns="1fr 1fr 1fr 1fr"
    >
        {/* <Typography 
          marginBottom="15px" 
          variant="h3" 
          color="#fff"
          gridColumn="span 4"
          textAlign="center"
        >
          Drone Details
        </Typography> */}
        <Box
            display="grid"
            gridTemplateColumns="1fr 1fr"
            gridColumn="span 3"
            gap="15px"
            alignItems="center"
            padding="1em"
        >
            <PropertyValueCard color={theme.palette.neutral.dark} property="Drone ID" value={data.drone_id}/>
            <PropertyValueCard color={theme.palette.neutral.dark} property="Name" value={data.name}/>
            <PropertyValueCard color={theme.palette.neutral.dark} property="Model" value={data.model}/>
            <PropertyValueCard color={theme.palette.neutral.dark} property="Type" value={data.type}/>
        </Box>
        <Box
          display="flex"
          alignItems="center"
        >
            <img 
                src="../../../images/drone12.png" 
                alt="Drone" 
                width="140" 
                height="140"
                style={{
                  filter: "drop-shadow(0 0 0.1rem #fff)",
                  animation: "pulse 1s infinite alternate"
                }}
                
            />
        </Box>
        <Box 
          display="flex" 
          gridColumn="span 4" 
          justifyContent="center" 
          marginTop='20px'
        >
          <Button 
            //color="error" 
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
            onClick={()=>handleChangeDroneClick()}
          >
              Track Another Drone
          </Button>
        </Box>

    </Box>
  )
}

export default DroneDetailsCard