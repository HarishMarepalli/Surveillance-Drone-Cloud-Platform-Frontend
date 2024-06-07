import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import axios from "axios";
import { useEffect,useState } from "react";
import { BASE_URL, API_ENDPOINTS } from '../../../config';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [usercount,setusercount]=useState(0);
  const [dronecount,setdronecount]=useState(0);
  const [missioncount,setmissioncount]=useState(0);
  const [missions,setmissions]=useState([]);

  const sendRequest = async () => {
    const res = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.countDrones}`
    );
    // console.log('Data received from backend:', res.data);
    return res.data;
  };

  const sendRequest1 = async () => {
    const res = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.countUsers}`
    );
    // console.log('Data received from backend:', res.data);
    return res.data;
  };

  const sendRequest2 = async () => {
    const res = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.countMissions}`
    );
    // console.log('Data received from backend:', res.data);
    return res.data;
  };

  let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
  // let userdetails = {
  //   role: "student",
  //   firstname: "Saiteja",
  //   lastname: "Goruganthu",
  //   email: "tirumalasaiteja.goruganthu@sjsu.edu"
  // }
  const TenantId=userdetails.email;

  const sendRequest3 = async () => {
    const res = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.getAllMissionPlans}/${TenantId}`
    );
    // console.log('Data received from backendmission:', res.data);
    return res.data;
  };

  useEffect(() => {
    async function fetchData() {
      const data = await sendRequest();
      const data1= await sendRequest1();
      const data2= await sendRequest2();
      const data3=await sendRequest3();
      setdronecount(data);
      setusercount(data1);
      setmissioncount(data2);
      setmissions(data3);
      // console.log("DATA3:",data3);
    }
    fetchData();
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header 
          title="DASHBOARD" 
          subtitle="Welcome to your dashboard"
          color={theme.palette.neutral.dark} 
        />

        {/* <Box>
          <Button
            sx={{
              // backgroundColor: colors.blueAccent[700],
              // color: colors.grey[500],
              // fontSize: "14px",
              // fontWeight: "bold",
              // padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={theme.palette.neutral.light}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="20px"
        >
          <StatBox
            title="20"
            subtitle="No of drones"
            progress="0.75"
            increase="+14%"
            // icon={
            //   <EmailIcon
            //     sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            //   />
            // }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={theme.palette.neutral.light}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="20px"
        >
          <StatBox
            title="45"
            subtitle="Number of Missions"
            progress="0.41"
            increase="+41%"
            // icon={
            //   <PointOfSaleIcon
            //     sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            //   />
            // }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={theme.palette.neutral.light}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="20px"
        >
          <StatBox
            title={usercount}
            subtitle="Users"
            progress="0.70"
            increase="+70%"
            // icon={
            //   <PersonAddIcon
            //     sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            //   />
            // }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={theme.palette.neutral.light}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="20px"
        >
          <StatBox
            title="130 hrs"
            subtitle="Total Flight Duration"
            progress="0.80"
            increase="+43%"
            // icon={
            //   <TrafficIcon
            //     sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            //   />
            // }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={theme.palette.neutral.light}
          p="30px"
          borderRadius="20px"
        >
          <Typography variant="h5" fontWeight="600">
          Subscription Amount
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $8,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={theme.palette.neutral.light}
          borderRadius="20px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Drones Owned
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={theme.palette.neutral.light}
          padding="30px"
          borderRadius="20px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
        {/* ROW 3 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.neutral.light}
          borderRadius="20px"
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[900]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $9,342.32
              </Typography>
            </Box>
            <Box>
              {/* <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton> */}
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={theme.palette.neutral.light}
          overflow="auto"
          borderRadius="20px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${theme.palette.secondary.light}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[900]} variant="h5" fontWeight="600">
              Recent Missions
            </Typography>
          </Box>
          {missions.map((mission, i) => (
            <Box
              key={`${mission._id}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${theme.palette.secondary.light}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {mission.MissionId}
                </Typography>
                <Typography color={colors.grey[900]}>
                  {mission.Location}
                </Typography>
              </Box>
              <Box color={colors.grey[900]}>{mission.drone_id}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {mission.TenantId}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
