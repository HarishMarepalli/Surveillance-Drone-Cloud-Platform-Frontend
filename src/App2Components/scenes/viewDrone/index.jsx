import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from 'axios';
import { Keyboard, Navigation, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import PropertyValueCard from '../../components/PropertyValueCard';
import 'swiper/css/navigation';
import { BASE_URL, API_ENDPOINTS } from '../../../config';

const ViewDrone = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [drones, setDrones] = useState([]);
  const [selectedDroneIndex, setSelectedDroneIndex] = useState(0);

  useEffect(() => {
    // Fetch drone data from backend when component mounts
    const fetchDrones = async () => {
      try {
        const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.getAllDrones}`);
        // console.log(response);
        setDrones(response.data);
      } catch (error) {
        console.error('Error fetching drone data:', error);
      }
    };

    fetchDrones();
  }, []);

  const handleSlideChange = (swiper) => {
    setSelectedDroneIndex(swiper.realIndex);
  };
  
  return (
    <Box 
      m="20px"
      padding="2em"
      backgroundColor={theme.palette.neutral.light}
      borderRadius="20px"
      // sx={{
      //   backgroundImage: 'url(../../../../images/dronebg4.jpg)',
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      //   width: '100%',
      //   //height: '300px', // Adjust height as needed
      // }}
    >
      <Header title="Drone Catalog" />
      <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          keyboard={{
            enabled: true,
          }}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          modules={[Keyboard, EffectCoverflow, Navigation]}
          spaceBetween={50}
          slidesPerView={3}
          // navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
          navigation={true}
          onSlideChange={(swiper) => handleSlideChange(swiper)}
        >
          {drones.map((drone, index) => (
            <SwiperSlide key={drone.drone_id}>
              <img
                src={`../../../../images/drone${index+3}.png`}
                alt={drone.name}
                width="300" 
                height="300"
                style={{
                  filter: `drop-shadow(0 0 0.1rem ${theme.palette.neutral.light})`
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        
        <Box>
          <Typography 
            marginBottom="30px" 
            marginTop="20px"
            variant="h1"
            fontWeight="bold" 
            color={theme.palette.neutral.dark}
          >
            {drones.length > 0 && drones[selectedDroneIndex].name}
          </Typography>
        </Box>
        
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr 1fr"
          gap="30px"
        >
          {/* Model */}
          <Box
              display="flex"
              flexDirection="column"
              height="200px"
              //border={`1px solid ${theme.palette.neutral.light}`}
              //backgroundImage="../../../../images/dronebg.png"
              backgroundColor={theme.palette.background.default}
              borderRadius="10px"
              marginBottom="20px"
              //marginRight="10px"
              boxShadow="5px 0px 10px 5px rgba(96,125,139,0.89)"
              gridColumn="span 1"
              gridRow="1/2"
            >
              <Box
                flex="50%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                //borderRight={`1px solid ${theme.palette.secondary.light}`}
              >
                <Typography 
                  marginBottom="15px" 
                  variant="h2" 
                  fontWeight="bold"
                  color={theme.palette.neutral.dark}
                >
                  Model
                </Typography>
              </Box>
              <Box
                flex="50%"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Typography 
                  marginBottom="15px" 
                  variant="h3" 
                  fontStyle="italic"
                  color={theme.palette.neutral.dark}
                >
                  {drones.length > 0 && drones[selectedDroneIndex].model}
                </Typography>
              </Box>
          </Box>
          
          {/* Type */}
          <Box
            display="flex"
            flexDirection="column"
            height="200px"
            //border={`1px solid ${theme.palette.secondary.light}`}
            backgroundColor={theme.palette.background.default}
            borderRadius="10px"
            marginBottom="20px" 
            boxShadow="5px 0px 10px 5px rgba(96,125,139,0.89)"
            gridColumn="span 1"
            gridRow="1/2"
          >

            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              
            >
              <Typography 
                marginBottom="15px" 
                variant="h2" 
                fontWeight="bold"
                color={theme.palette.neutral.dark}
              >
                Type
              </Typography>
            </Box>
            
            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              //borderRight={`1px solid ${theme.palette.secondary.light}`}
            >
              <Typography 
                marginBottom="15px" 
                variant="h3" 
                fontStyle="italic"
                color={theme.palette.neutral.dark}
              >
                {drones.length > 0 && drones[selectedDroneIndex].type}
              </Typography>
            </Box>
          </Box>

          {/* Manufacturer */}
          <Box
            display="flex"
            flexDirection="column"
            height="200px"
            //border={`1px solid ${theme.palette.secondary.light}`}
            backgroundColor={theme.palette.background.default}
            borderRadius="10px"
            marginBottom="20px" 
            boxShadow="5px 0px 10px 5px rgba(96,125,139,0.89)"
            gridColumn="span 1"
            gridRow="1/2"
          >

            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              
            >
              <Typography 
                marginBottom="15px" 
                variant="h2" 
                fontWeight="bold"
                color={theme.palette.neutral.dark}
              >
                Manufacturer
              </Typography>
            </Box>
            
            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              //borderRight={`1px solid ${theme.palette.secondary.light}`}
            >
              <Typography 
                marginBottom="15px" 
                variant="h3" 
                fontStyle="italic"
                color={theme.palette.neutral.dark}
              >
                {drones.length > 0 && drones[selectedDroneIndex].manufacturer}
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          <Box
            display="flex"
            flexDirection="column"
            //height="300px"
            //border={`1px solid ${theme.palette.secondary.light}`}
            backgroundColor={theme.palette.background.default}
            borderRadius="10px"
            marginBottom="20px" 
            boxShadow="5px 0px 10px 5px rgba(96,125,139,0.89)"
            gridColumn="span 1"
            gridRow="2/4"
          >

            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              
            >
              <Typography 
                marginBottom="15px" 
                variant="h2" 
                fontWeight="bold"
                color={theme.palette.neutral.dark}
              >
                Description
              </Typography>
            </Box>
            
            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              padding="1em"
              //borderRight={`1px solid ${theme.palette.secondary.light}`}
            >
              <Typography 
                marginBottom="15px" 
                variant="h4" 
                fontStyle="italic"
                color={theme.palette.neutral.dark}
              >
                {drones.length > 0 && drones[selectedDroneIndex].description}
              </Typography>
            </Box>
          </Box>

          {/* Price */}
          <Box
            display="flex"
            flexDirection="column"
            height="200px"
            //border={`1px solid ${theme.palette.secondary.light}`}
            backgroundColor={theme.palette.background.default}
            borderRadius="10px"
            marginBottom="20px" 
            boxShadow="5px 0px 10px 5px rgba(96,125,139,0.89)"
            gridColumn="span 1"
            gridRow="2/3"
          >

            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              
            >
              <Typography 
                marginBottom="15px" 
                variant="h2" 
                fontWeight="bold"
                color={theme.palette.neutral.dark}
              >
                Price
              </Typography>
            </Box>
            
            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              //borderRight={`1px solid ${theme.palette.secondary.light}`}
            >
              <Typography 
                marginBottom="15px" 
                variant="h3" 
                fontStyle="italic"
                color={theme.palette.neutral.dark}
              >
                {drones.length > 0 && '$' + drones[selectedDroneIndex].price}
              </Typography>
            </Box>
          </Box>

          {/* Weight */}
          <Box
            display="flex"
            flexDirection="column"
            height="200px"
            //border={`1px solid ${theme.palette.secondary.light}`}
            backgroundColor={theme.palette.background.default}
            borderRadius="10px"
            marginBottom="20px" 
            boxShadow="5px 0px 10px 5px rgba(96,125,139,0.89)"
            gridColumn="span 1"
            gridRow="2/3"
          >

            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              
            >
              <Typography 
                marginBottom="15px" 
                variant="h2" 
                fontWeight="bold"
                color={theme.palette.neutral.dark}
              >
                Weight
              </Typography>
            </Box>
            
            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              //borderRight={`1px solid ${theme.palette.secondary.light}`}
            >
              <Typography 
                marginBottom="15px" 
                variant="h3" 
                fontStyle="italic"
                color={theme.palette.neutral.dark}
              >
                {drones.length > 0 && drones[selectedDroneIndex].weight + 'g'}
              </Typography>
            </Box>
          </Box>

          {/* Dimensions */}
          <Box
            display="flex"
            flexDirection="column"
            height="200px"
            //border={`1px solid ${theme.palette.secondary.light}`}
            backgroundColor={theme.palette.background.default}
            borderRadius="10px"
            marginBottom="20px" 
            boxShadow="5px 0px 10px 5px rgba(96,125,139,0.89)"
            gridColumn="span 1"
            gridRow="3/4"
          >

            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              
            >
              <Typography 
                marginBottom="15px" 
                variant="h2" 
                fontWeight="bold"
                color={theme.palette.neutral.dark}
              >
                Dimensions
              </Typography>
            </Box>
            
            <Box
              flex="50%"
              display="flex"
              justifyContent="space-around"
              alignItems="center"
              //borderRight={`1px solid ${theme.palette.secondary.light}`}
            >
              <PropertyValueCard 
                property="Length" 
                value={drones.length > 0 && drones[selectedDroneIndex].dimensions.length + 'm'} 
                color={theme.palette.neutral.dark}
              />
              <PropertyValueCard 
                property="Width" 
                value={drones.length > 0 && drones[selectedDroneIndex].dimensions.width + 'm'} 
                color={theme.palette.neutral.dark}
              />
              <PropertyValueCard 
                property="Height" 
                value={drones.length > 0 && drones[selectedDroneIndex].dimensions.height + 'm'} 
                color={theme.palette.neutral.dark}
              />
            </Box>
          </Box>

          {/* Max Speed */}
          <Box
            display="flex"
            flexDirection="column"
            height="200px"
            //border={`1px solid ${theme.palette.secondary.light}`}
            backgroundColor={theme.palette.background.default}
            borderRadius="10px"
            marginBottom="20px" 
            boxShadow="5px 0px 10px 5px rgba(96,125,139,0.89)"
            gridColumn="span 1"
            gridRow="3/4"
          >

            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              
            >
              <Typography 
                marginBottom="15px" 
                variant="h2" 
                fontWeight="bold"
                color={theme.palette.neutral.dark}
              >
                Maximum Speed
              </Typography>
            </Box>
            
            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              //borderRight={`1px solid ${theme.palette.secondary.light}`}
            >
              <Typography 
                marginBottom="15px" 
                variant="h3" 
                fontStyle="italic"
                color={theme.palette.neutral.dark}
              >
                {drones.length > 0 && drones[selectedDroneIndex].max_speed + 'm/s'}
              </Typography>
            </Box>
          </Box>

          {/* Battery Capacity */}
          <Box
            display="flex"
            flexDirection="column"
            height="200px"
            //border={`1px solid ${theme.palette.secondary.light}`}
            backgroundColor={theme.palette.background.default}
            borderRadius="10px"
            marginBottom="20px" 
            boxShadow="5px 0px 10px 5px rgba(96,125,139,0.89)"
            gridColumn="span 1"
            gridRow="4/5"
          >

            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              
            >
              <Typography 
                marginBottom="15px" 
                variant="h2" 
                fontWeight="bold"
                color={theme.palette.neutral.dark}
              >
                Battery Capacity
              </Typography>
            </Box>
            
            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              //borderRight={`1px solid ${theme.palette.secondary.light}`}
            >
              <Typography 
                marginBottom="15px" 
                variant="h3" 
                fontStyle="italic"
                color={theme.palette.neutral.dark}
              >
                {drones.length > 0 && drones[selectedDroneIndex].battery_capacity + 'mAh'}
              </Typography>
            </Box>
          </Box>

          {/* Range */}
          <Box
            display="flex"
            flexDirection="column"
            height="200px"
            //border={`1px solid ${theme.palette.secondary.light}`}
            backgroundColor={theme.palette.background.default}
            borderRadius="10px"
            marginBottom="20px" 
            boxShadow="5px 0px 10px 5px rgba(96,125,139,0.89)"
            gridColumn="span 1"
            gridRow="4/5"
          >

            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              
            >
              <Typography 
                marginBottom="15px" 
                variant="h2" 
                fontWeight="bold"
                color={theme.palette.neutral.dark}
              >
                Range
              </Typography>
            </Box>
            
            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              //borderRight={`1px solid ${theme.palette.secondary.light}`}
            >
              <Typography 
                marginBottom="15px" 
                variant="h3" 
                fontStyle="italic"
                color={theme.palette.neutral.dark}
              >
                {drones.length > 0 && drones[selectedDroneIndex].range + 'mi'}
              </Typography>
            </Box>
          </Box>

          {/* Camera Specs */}
          <Box
            display="flex"
            flexDirection="column"
            height="250px"
            //border={`1px solid ${theme.palette.secondary.light}`}
            backgroundColor={theme.palette.background.default}
            borderRadius="10px"
            marginBottom="20px" 
            boxShadow="5px 0px 10px 5px rgba(96,125,139,0.89)"
            gridColumn="span 1"
            gridRow="5/6"
          >

            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              
            >
              <Typography 
                marginBottom="15px" 
                variant="h2" 
                fontWeight="bold"
                color={theme.palette.neutral.dark}
              >
                Camera Specs
              </Typography>
            </Box>
            
            <Box
              flex="50%"
              display="grid"
              justifyContent="space-around"
              alignItems="center"
              gridTemplateColumns="1fr 1fr"
              //borderRight={`1px solid ${theme.palette.secondary.light}`}
            >
              <Box
                gridColumn="span 1"
                mb={2}
              >
                <PropertyValueCard 
                  property="Resolution" 
                  value={drones.length > 0 && drones[selectedDroneIndex].camera_specs.resolution} 
                  color={theme.palette.neutral.dark}
                />
              </Box>

              <Box
                gridColumn="span 1"
                mb={2}
              >
                <PropertyValueCard 
                  property="Sensor" 
                  value={drones.length > 0 && drones[selectedDroneIndex].camera_specs.sensor_size} 
                  color={theme.palette.neutral.dark}
                />
              </Box>
              <Box
                gridColumn="span 1"
                mb={2}
              >
                <PropertyValueCard 
                  property="Max Aperture" 
                  value={drones.length > 0 && drones[selectedDroneIndex].camera_specs.max_aperture} 
                  color={theme.palette.neutral.dark}
                />
              </Box>
              <Box
                gridColumn="span 1"
                mb={2}
              >
                <PropertyValueCard 
                  property="Field Of View" 
                  value={drones.length > 0 && drones[selectedDroneIndex].camera_specs.field_of_view + 'deg'} 
                  color={theme.palette.neutral.dark}
                />
              </Box>
            </Box>
          </Box>

          {/* Lidar */}
          <Box
            display="flex"
            flexDirection="column"
            height="200px"
            //border={`1px solid ${theme.palette.secondary.light}`}
            backgroundColor={theme.palette.background.default}
            borderRadius="10px"
            marginBottom="20px" 
            boxShadow="5px 0px 10px 5px rgba(96,125,139,0.89)"
            gridColumn="span 1"
            gridRow="4/5"
          >

            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              
            >
              <Typography 
                marginBottom="15px" 
                variant="h2" 
                fontWeight="bold"
                color={theme.palette.neutral.dark}
              >
                Lidar
              </Typography>
            </Box>
            
            <Box
              flex="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              //borderRight={`1px solid ${theme.palette.secondary.light}`}
            >
              <Typography 
                marginBottom="15px" 
                variant="h3" 
                fontStyle="italic"
                color={theme.palette.neutral.dark}
              >
                {drones.length > 0 && drones[selectedDroneIndex].lidar ? 'Enabled' : 'Not Supported'}
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* <div>
          <h2>{drones.length > 0 && drones[selectedDroneIndex].name}</h2>
          <p>Model: {drones.length > 0 && drones[selectedDroneIndex].model}</p>
          <p>Type: {drones.length > 0 && drones[selectedDroneIndex].type}</p>
        </div> */}
        <style>
          {`.swiper-slide-active {
                border-radius: 85px;
                background-color: ${theme.palette.secondary.main};
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 50px;
            }`}
        </style>
    </Box>
  );
};

export default ViewDrone;
