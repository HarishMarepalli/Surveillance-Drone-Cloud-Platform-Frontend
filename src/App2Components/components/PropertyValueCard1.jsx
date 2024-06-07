import React from 'react'
import { Box, Typography, useTheme } from '@mui/material';

const PropertyValueCard1 = ({property, value, color}) => {
    const theme = useTheme();
  return (
    <Box>
        <Typography
            variant="h4"
            fontWeight="bold"
            // sx={{ color: colors.grey[900] }}
            color={color ? color : theme.palette.neutral.dark}
            textAlign="center"
        >
            {property}
        </Typography>
        <Typography
            variant="h5"
            fontStyle="italic"
            //sx={{ color: colors.greenAccent[600] }}
            color={color ? color : theme.palette.neutral.dark}
            style={{textAlign: "center"}}
            mt="10px"
        >
            {value}
        </Typography>
    </Box>
  )
}

export default PropertyValueCard1