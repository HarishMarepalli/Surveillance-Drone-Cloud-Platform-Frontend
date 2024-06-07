import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

// const liveNotifications = [
//     {
//       dateTime: "3rd July, 9:30am",
//       message: "Phantom 4 Drone is initiated",
//       missionID: 1,
//       missionName: "SJSU Surveillance",
//       severity: 0 //0-ok, 1-Warning, 2-Error
//     },
//     {
//       dateTime: "3rd July, 9:35am",
//       message: "Phantom 3 Drone is deployed",
//       missionID: 2,
//       missionName: "City Park Monitoring",
//       severity: 1
//     },
//     {
//       dateTime: "3rd July, 9:40am",
//       message: "Mavic Air Drone is flying",
//       missionID: 3,
//       missionName: "Traffic Monitoring",
//       severity: 2
//     },
//     {
//       dateTime: "3rd July, 9:45am",
//       message: "Inspire 2 Drone is returning to base",
//       missionID: 4,
//       missionName: "Fire Incident Surveillance",
//       severity: 1
//     },
//     {
//       dateTime: "3rd July, 9:50am",
//       message: "Phantom 4 Pro Drone is landing",
//       missionID: 5,
//       missionName: "Emergency Response",
//       severity: 0
//     },
//     {
//       dateTime: "3rd July, 9:55am",
//       message: "Phantom 4 Drone battery is low",
//       missionID: 6,
//       missionName: "Search and Rescue",
//       severity: 2
//     },
//     {
//       dateTime: "3rd July, 10:00am",
//       message: "Phantom 4 Drone completed mission",
//       missionID: 7,
//       missionName: "Security Patrol",
//       severity: 0
//     },
//     {
//       dateTime: "3rd July, 10:05am",
//       message: "Mavic Mini Drone is offline",
//       missionID: 8,
//       missionName: "Wildlife Monitoring",
//       severity: 0
//     },
//     {
//       dateTime: "3rd July, 10:10am",
//       message: "Phantom 3 Drone encountered obstacle",
//       missionID: 9,
//       missionName: "Surveying",
//       severity: 2
//     },
//     {
//       dateTime: "3rd July, 10:15am",
//       message: "Phantom 4 Drone is ready for next mission",
//       missionID: 10,
//       missionName: "Crop Monitoring",
//       severity: 1
//     }
//   ];
  
const LiveNotificationCard = ({ liveNotifications, displayMissionDetails = false }) => {
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const formatMongoDate = (mongoDate) => {
      const date = new Date(mongoDate);
      //console.log(date);
      const options = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
      const formattedDate = date.toLocaleDateString('en-US', options);
      //console.log(formattedDate);
      const timezoneOffset = date.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2];
      //console.log(timezoneOffset);
      return `${formattedDate}, ${timezoneOffset}`;
  };

    return (
    <>
    {liveNotifications.map((notification, index) => {
        // Define a variable to store the class names based on severity
        let classNames = 'messageBox';

        // Conditionally append class names based on severity
        if (notification.msg_severity === 0) {
          classNames += ' low-severity';
        } else if (notification.msg_severity === 1) {
          classNames += ' medium-severity';
        } else if (notification.msg_severity === 2) {
          classNames += ' high-severity';
        }else if (notification.msg_severity === 3) {
          classNames += ' critical-severity';
        }

        return (
        <Box 
            className={classNames}
            key={index}
            backgroundColor={theme.palette.mode == "light" ? theme.palette.background.default: theme.palette.secondary.light}
            margin='2em'
            padding='2em'
            borderRadius='20px'
        >
            <Typography
                variant="h6"
                color={theme.palette.mode == "light" ? theme.palette.neutral.dark: theme.palette.neutral.light}
                textAlign="center"
            >
                {formatMongoDate(notification.timestamp)}
            </Typography>
            <Typography
                variant="h3"
                fontWeight="bold"
                color={theme.palette.mode == "light" ? theme.palette.neutral.dark: theme.palette.neutral.light}
                textAlign="center"
                textOverflow='ellipsis'
                //marginBottom="20px"
            >
                {notification.message}
            </Typography>
            <Typography
                variant="h6"
                fontWeight="bold"
                color={theme.palette.mode == "light" ? theme.palette.neutral.dark: theme.palette.neutral.light}
                textAlign="center"
                textOverflow='ellipsis'
                //marginBottom="20px"
            >
                {"Category: " + notification.msg_category}
            </Typography>
            <Typography
                variant="h6"
                fontWeight="bold"
                color={theme.palette.mode == "light" ? theme.palette.neutral.dark: theme.palette.neutral.light}
                textAlign="center"
                textOverflow='ellipsis'
                marginBottom={displayMissionDetails ? "20px" :"0px"}
            >
                {"Command: " + notification.mav_command}
            </Typography>
            {
              displayMissionDetails && 
                <>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color={theme.palette.mode == "light" ? theme.palette.neutral.dark: theme.palette.neutral.light}
                    textAlign="center"
                >
                    {notification.mission_id}
                </Typography>
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    color={theme.palette.mode == "light" ? theme.palette.neutral.dark: theme.palette.neutral.light}
                    textAlign="center"
                >
                    {notification.mission_type}
                </Typography>
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    color={theme.palette.mode == "light" ? theme.palette.neutral.dark: theme.palette.neutral.light}
                    textAlign="center"
                >
                    {notification.mission_location}
                </Typography>
              </>
            }
            
        </Box>
        );
    })}
    </>
    );
}

export default LiveNotificationCard