import React, {useState, useEffect}  from'react';
import { useLocation } from 'react-router-dom';
import {useTheme} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';

function MissionPlanner({setSelected}) {
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { state } = location;
  const [snackbarState, setSnackbarState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  // const { vertical, horizontal, open } = snackbarState;
  // const [snackbarMsg, setSnackbarMsg] = React.useState('');

  // Access individual state variables
  const { mission_type, drone_id, user_id, missionId, mission_name, mission_description, mission_start_time, mission_end_time } = state || {};
  //console.log(props);
  // mission_type = props.mission_type;
  // drone_id = props.drone_id;
  // user_id = props.user_id;
  // missionId = props.missionId;
  // console.log(mission_type);
  // console.log(drone_id);
  // console.log(user_id);
  // console.log(missionId);
  // console.log(mission_name);
  // console.log(mission_description);
  // console.log(mission_start_time);
  // console.log(mission_end_time);
  // You might want to encode the parameters to ensure they are URL-safe.
  const serviceTypeEncoded = encodeURIComponent(mission_type);
  const droneIdEncoded = encodeURIComponent(drone_id);
  const tenantIdEncoded = encodeURIComponent(user_id);
  const missionIdEncoded = encodeURIComponent(missionId);
  const missionNameEncoded = encodeURIComponent(mission_name);
  const missionDescEncoded = encodeURIComponent(mission_description);
  const missionStartEncoded = encodeURIComponent(mission_start_time);
  const missionEndEncoded = encodeURIComponent(mission_end_time);

  // Modify the src URL to include the serviceType and droneId as query parameters.
  const iframeSrc = `my-app1.html?serviceType=${serviceTypeEncoded}&droneId=${droneIdEncoded}&tenantId=${tenantIdEncoded}&missionId=${missionIdEncoded}&missionName=${missionNameEncoded}&missionDesc=${missionDescEncoded}&missionStartTime=${missionStartEncoded}&missionEndTime=${missionEndEncoded}`;
  // console.log(serviceTypeEncoded);
  // console.log(droneIdEncoded);
  // console.log(tenantIdEncoded);
  // console.log(missionIdEncoded);
  // console.log(missionNameEncoded);
  // console.log(missionDescEncoded);
  // console.log(missionStartEncoded);
  // console.log(missionEndEncoded);

  useEffect(() => {
    // Listen for changes in localStorage
    const handleStorageChange = () => {
      // Get the click state from localStorage
      const clickState = localStorage.getItem('clickState');
      //alert('Hi');
      // If clickState is true, navigate to the desired page
      if (clickState === 'true') {
        setSelected('View Missions');
        navigate('/dashboard/viewMissions', { state: { extraInfo: "Mission Created/Updated Successfully" } });
        //window.location.reload();
        // Reset the click state in localStorage
        localStorage.setItem('clickState', 'false');
        //setSnackbarMsg(localStorage.getItem('clickResult'));
      }
    };

    // Add event listener for storage change
    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Remove event listener when component unmounts
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      setSnackbarState({ ...state, open: false });
  };

  return (
    <div>
      <iframe 
        id="myFrame"
        src={iframeSrc}
        width="100%" 
        height={960}
        frameBorder="0"
        scrolling="no"
      ></iframe>
      {/* <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message={snackbarMsg}
        key={vertical + horizontal}
        sx={{
            "& .MuiSnackbarContent-root":{
                backgroundColor: theme.palette.secondary.light,
            },
            "& .MuiSnackbarContent-message" : {
                fontSize: '1.3em',
                fontWeight: 'bold',
                color: theme.palette.neutral.light
            }
        }}
      /> */}
    </div>
  );
}

export default MissionPlanner;

// import React from'react';

// function MissionPlanner() {

//   return (
//     <div>
//       <iframe 
//         id="myFrame"
//         src={"my-app1.html"}
//         width="100%" 
//         height={960}
//         frameBorder="0"
//         scrolling="no"
//       ></iframe>
//     </div>
//   )
// }

// export default MissionPlanner;
