import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./App2Components/theme";

import Home from './components/pages/Home';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import {
  ViewDronePage,
  CreateDronePage,
  EditDronePage,
  ViewDroneStatistics, 
  TrackDronePage, 
  TrackingDashboardPage, 
  ConfigureTrackingPage,
  TrackingDronePage
} from './App2Components/App';
import {GetMissionsPage,CreateMissionPage, GetFarmsPage, CreateMapPage, ViewMissionPlanner} from './App2Components/App';
import {ViewDashboard,ViewSchedulePage,CreateSchedulePage,EditSchedulePage} from './App2Components/App';
import {ViewBar,ViewPie,ViewLine,ViewFaq,ViewGeography,ViewContacts,ViewCalendar} from './App2Components/App';
import {GetVideoDashboard,UploadPage} from './App2Components/App';

import Topbar from "./App2Components/scenes/global/Topbar";
import Sidebar from "./App2Components/scenes/global/Sidebar";
import Dashboard from "./App2Components/scenes/dashboard";
import Team from "./App2Components/scenes/team";
import Invoices from "./App2Components/scenes/invoices";
import Contacts from "./App2Components/scenes/contacts";
import Bar from "./App2Components/scenes/bar";
import Form from "./App2Components/scenes/form";
import Line from "./App2Components/scenes/line";
import Pie from "./App2Components/scenes/pie";
import FAQ from "./App2Components/scenes/faq";
import Geography from "./App2Components/scenes/geography";
import CreateSchedule from "./App2Components/scenes/CreateSchedule"
import ViewScheules from "./App2Components/scenes/ViewScheules"
import CreateDrone from './App2Components/scenes/createDrone';
import ViewDrone from './App2Components/scenes/viewDrone';
import CreateMission from './App2Components/scenes/createMission';
import AddMapForm from './App2Components/scenes/addMap';
import GetAllMissions from './App2Components/scenes/getMissions';
import GetAllMaps from './App2Components/scenes/getFarmMaps';


function AppContent() {
  const location = useLocation();
  const shouldRenderNavbar = !location.pathname.includes("/dashboard");
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);



  return (
    <div className="App">
      {/* {shouldRenderNavbar && <Navbar />} */}
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/*" element={<ViewDashboard />} />
        <Route path="/dashboard/viewSchedular" element={<ViewSchedulePage />} />
        <Route path="/dashboard/createSchedular" element={<CreateSchedulePage />} />
        <Route path="/dashboard/editSchedule" element={<EditSchedulePage />} />
        <Route path="/dashboard/viewDrone" element={<ViewDronePage />} />
        <Route path="/dashboard/createDrone" element={<CreateDronePage />} />
        <Route path="/dashboard/editDrone" element={<EditDronePage />} />
        <Route path="/dashboard/dronestatistics" element={<ViewDroneStatistics />} />
        <Route path="/dashboard/trackdrone" element={<TrackDronePage />} />
        <Route path="/dashboard/bar" element={<ViewBar />} />
        <Route path="/dashboard/pie" element={<ViewPie />} />
        <Route path="/dashboard/line" element={<ViewLine />} />
        <Route path="/dashboard/faq" element={<ViewFaq />} />
        <Route path="/dashboard/geography" element={<ViewGeography />} />
        <Route path="/dashboard/contacts" element={<ViewContacts />} />
        <Route path="dashboard/calendar" element={<ViewCalendar />} />
        <Route path="/dashboard/createMission" element={<CreateMissionPage />} />
        <Route path="/dashboard/addMap" element={<CreateMapPage />} />
        <Route path="/dashboard/getMissions" element={<GetMissionsPage />} />
        <Route path="/dashboard/getMaps" element={<GetFarmsPage />} />
        <Route path="/dashboard/uploadVideo" element={<UploadPage/>} />
        <Route path="/dashboard/videos" element={<GetVideoDashboard/>} />
        <Route path="/dashboard/missionPlanner" element={<ViewMissionPlanner/>} />

        {/* Saiteja */}
        <Route path="/tracking/dashboard" element={<TrackingDashboardPage />} />
        <Route path="/tracking/configure" element={<ConfigureTrackingPage />} />
        <Route path="/tracking/:droneId/mission/:missionId" element={<TrackingDronePage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
