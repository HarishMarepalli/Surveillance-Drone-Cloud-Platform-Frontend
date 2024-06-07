import { Box, Typography, useTheme, Chip } from "@mui/material";
import { tokens } from "../theme";

const statusColors = {
    Active: '#4caf50',     // Green color for Active status
    Connected: 'yellow',  // Yellow color for Connected status
    Stopped: '#ff9800',    // Orange color for Stopped status
    Repair: '#f44336',     // Red color for Repair status
    Charging: 'darkmagenta'
};

const DroneCard = ({filteredDrone, onCardClick}) => {
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Function to get the color based on status
  const getColorForStatus = (status) => {
    return statusColors[status] || '#000000'; // Default to black if status is not found
  };
  return (
    <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        borderRadius="20px"
        margin="2em"
        marginRight="0px"
        padding="1em"
        backgroundColor={theme.palette.background.default}
        border="1px solid #fff"
        sx={{cursor: 'pointer'}}
        onClick = {()=>onCardClick(filteredDrone.id)}
    >
       <Box>
            <Typography
                variant="h5"
                sx={{ color: theme.palette.neutral.dark }}
            >
                Drone ID #
            </Typography>
            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: colors.grey[900] }}
            >
                {filteredDrone.id}
            </Typography>
            <Typography
                variant="h5"
                sx={{ color: colors.grey[900] }}
            >
                {filteredDrone.properties.name}
            </Typography>
        </Box>
        <Box>
            <img 
                src={filteredDrone.properties.imgUrl} 
                alt={filteredDrone.properties.description} 
                width={10 + filteredDrone.properties.iconSize[0]}
                height={10 +filteredDrone.properties.iconSize[1]} 
                style={{
                    filter: "drop-shadow(0 0 0.1rem #fff)",
                    animation: filteredDrone.properties.status === 'Active'? "pulse 1s infinite alternate" : "none"
                }}   
            />
        </Box>
        <Box>
            <Chip 
                label={filteredDrone.properties.status}
                // color={
                //     filteredDrone.properties.status === 'Active' ? 'success' : 
                //     filteredDrone.properties.status === 'Connected' ? 'warning' : 
                //     filteredDrone.properties.status === 'Stopped' ? '#f00' : 'error'
                // }
                style={{
                    height: "40px", 
                    width: "7em", 
                    fontSize: "14px", 
                    fontWeight: "bold", 
                    color: (filteredDrone.properties.status === 'Connected' || filteredDrone.properties.status === 'Stopped') ? '#000' : '#fff', 
                    backgroundColor: getColorForStatus(filteredDrone.properties.status)
                }}
            />
        </Box>
    </Box>
  )
}

export default DroneCard