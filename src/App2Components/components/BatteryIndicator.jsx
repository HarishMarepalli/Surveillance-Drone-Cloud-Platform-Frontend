import React from 'react';
import { Typography, Box, Icon, useTheme } from '@mui/material';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import Battery50Icon from '@mui/icons-material/Battery50';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';

const BatteryIndicator = ({ batteryPercentage }) => {
  let BatteryIcon;
  const theme = useTheme();

  if (batteryPercentage >= 75) {
    BatteryIcon = BatteryFullIcon;
  } else if (batteryPercentage >= 50) {
    BatteryIcon = Battery50Icon;
  } else if (batteryPercentage >= 20) {
    BatteryIcon = Battery20Icon;
  } else {
    BatteryIcon = BatteryAlertIcon;
  }

  return (
    <Box display="flex" alignItems="center" justifyContent='center'>
      <Icon 
        component={BatteryIcon} 
        sx={{ 
          transform: 'rotate(-90deg)', 
          marginRight: '8px', 
          fontSize: '56px',
          color:theme.palette.neutral.dark
        }} 
      />
      <Typography fontSize='18px' color={theme.palette.neutral.dark}>{batteryPercentage}%</Typography>
    </Box>
  );
};

export default BatteryIndicator;