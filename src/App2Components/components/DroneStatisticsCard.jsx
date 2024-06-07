import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const DroneStatisticsCard = ({ title, count }) => {
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    return (
        <Box 
            display="flex" 
            justifyContent="space-between" 
            flexDirection="column"
        >
            <Typography
                variant="h5"
                fontWeight="bold"
                // sx={{ color: colors.grey[900] }}
                color={theme.palette.neutral.light}
                textAlign="center"
            >
                {title}
            </Typography>
            <Typography
                variant="h1"
                fontStyle="italic"
                //sx={{ color: colors.greenAccent[600] }}
                color={theme.palette.neutral.light}
                style={{textAlign: "center"}}
                mt="10px"
            >
                {count}
            </Typography>
        </Box>
    );
}

export default DroneStatisticsCard