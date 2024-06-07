import { createContext, useContext, useState, useEffect } from "react";
import * as React from 'react';
import "react-pro-sidebar/dist/css/styles.css";
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import {Link as Url} from "@mui/material";
import Modal from '@mui/material/Modal';
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

import SettingsIcon from '@mui/icons-material/Settings';
import prof from './user.png'
import sai from './sai.jpg';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  console.log("Clicked: " + title);
  console.log("Selected: " + selected);
  console.log("To: " + to);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[900],
      }}
      onClick={() => setSelected(title)}
      component={<Link to={to} />}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
  // const handleClick = () => {
  //   console.log('Clicked:', title);
  //   setSelected(title);
  //   console.log('Selected:', selected);
  // };
  // let userdetails = {
  //   role: "student",
  //   firstname: "Saiteja",
  //   lastname: "Goruganthu",
  //   email: "tirumalasaiteja.goruganthu@sjsu.edu"
  // }

  /*useEffect(() => {
    setSelected(window.sessionStorage.getItem("selected"));
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("selected", selected);
  }, [selected]);*/

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const handleSetSelected = (value) => {
  //   console.log('Selected value:', value);
  //   setSelected(prevSelected => prevSelected !== value ? value : prevSelected);
  //   console.log('Updated selected state:', selected);
  // };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div 
      className= "sidebar-container"
      style={{
        margin: '1em',
        
      }}
    >
      <Box
        sx={{
          "& .pro-sidebar": {
            width: '300px',
          },
          "& .pro-sidebar.collapsed": {
            width: '80px',
          },
          "& .pro-sidebar-inner": {
            background: `${theme.palette.neutral.light} !important`,
            borderRadius: '20px',
            borderTopRightRadius: '0px',
            borderBottomRightRadius: '0px'
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: `${theme.palette.secondary.dark} !important`,
          },
          "& .pro-menu-item.active": {
            //color: "#6870fa !important",
            background: `${theme.palette.secondary.light} !important`,
            borderRadius: '10px',
            color: `${theme.palette.neutral.dark} !important`
          },
        }}
      >
        <ProSidebar 
          collapsed={isCollapsed}
        >
          <Menu iconShape="square">
            {/* LOGO AND MENU ICON */}
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[500]}>
                    {userdetails.role}
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>
              {/* USER */}
            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={
                      userdetails.firstname=="gao"? prof
                      :userdetails.lastname=="Goruganthu"? sai
                      :"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[900]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    {/* {userdetails?.role==="admin"?userdetails?.firstname:"Security"} */}
                    {userdetails?.firstname}
                  </Typography>
                  {/* <Url underline="none" onClick={handleOpen}> */}
                  <Typography variant="h5" color={theme.palette.secondary.light} onClick={handleOpen}>
                    Profile info
                  </Typography>
                  {/* </Url> */}
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Profile Details
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        First name :  {userdetails.firstname ? userdetails.firstname:"NA"}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Last name :  {userdetails.lastname ? userdetails.lastname:"NA"}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Email :  {userdetails.email ? userdetails.email:"NA"}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Role :  {userdetails.role ? userdetails.role:"NA"}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Contact :  {userdetails.contact ? userdetails.contact:"NA"}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Location :  {userdetails.location ? userdetails.location:"NA"}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Gender :  {userdetails.gender ? userdetails.gender:"NA"}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Age :  {userdetails.age ? userdetails.age:"NA"}
                      </Typography>
                    </Box>
                  </Modal>
                </Box>
              </Box>
            )}
            {/* MENU */}
            <Box
              padding='0 2.5em'
            >
              <Item
                title="Dashboard"
                to="/dashboard"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            
            <Typography
                variant="h6"
                color={theme.palette.secondary.light}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Device Management
              </Typography>
              <Item
                title="Drone Catalog"
                to="/dashboard/viewDrone"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {/* <MenuItem
                active={selected === "Drone Catalog"}
                style={{
                  color: colors.grey[900],
                }}
                onClick={handleClick("Drone Catalog")}
                icon={<PeopleOutlinedIcon />}
              >
                <Typography>{"Drone Catalog"}</Typography>
                <Link to={to} />
              </MenuItem> */}
              <Item
                title="Add New Drone"
                to="/dashboard/createDrone"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="View Schedular"
                to="/dashboard/viewSchedular"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Create Schedular"
                to="/dashboard/createSchedular"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Drone Statistics"
                to="/dashboard/dronestatistics"
                icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />


              {/*New Code - Saiteja*/}
              <Typography
                variant="h6"
                color={theme.palette.secondary.light}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Tracking Manager
              </Typography>
              <Item
                title="Tracking Dashboard"
                to="/tracking/dashboard"
                icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Configure Tracking"
                to="/tracking/configure"
                icon={<SettingsIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {/*New Code - Saiteja*/}


              <Typography
                variant="h6"
                color={theme.palette.secondary.light}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Mission Planner
              </Typography>
              <Item
                title="Mission Planner"
                to="/dashboard/missionPlanner"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Create Mission"
                to="/dashboard/createMission"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Get Missions"
                to="/dashboard/getMissions"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Add Campus Map"
                to="/dashboard/addMap"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Get Campus Maps"
                to="/dashboard/getMaps"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Add Video"
                to="/dashboard/uploadVideo"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Get Videos"
                to="/dashboard/videos"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant="h6"
                color={theme.palette.secondary.light}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Pages
              </Typography>
              <Item
                title="Profile Form"
                to="/dashboard/form"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Calendar"
                to="/dashboard/calendar"
                icon={<CalendarTodayOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Invoices"
                to="/dashboard/invoices"
                icon={<HelpOutlineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Contacts Information"
                to="/dashboard/contacts"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Typography
                variant="h6"
                color={theme.palette.secondary.light}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Charts
              </Typography>
              <Item
                title="Bar Chart"
                to="/dashboard/bar"
                icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Pie Chart"
                to="/dashboard/pie"
                icon={<PieChartOutlineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Line Chart"
                to="/dashboard/line"
                icon={<TimelineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Geography Chart"
                to="/dashboard/geography"
                icon={<MapOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Menu>
        </ProSidebar>
      </Box>

      <style>
          {`.sidebar-container::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: ${theme.palette.mode == 'light' ? '#9c27b0' : '#4cceac'};
      }`}
      </style>
    </div>
  );
};

export default Sidebar;
