import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route } from "react-router-dom";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import TrackingDashboard from "./scenes/trackingDashboard";
import TrackingDrone from "./scenes/trackingDrone";
import { useState } from "react";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import ViewDrone from "./scenes/viewDrone";
import CreateDrone from "./scenes/createDrone";
import EditDrone from "./scenes/EditDrone";
import EditSchedule from "./scenes/EditSchedule";
import ViewSchedule from "./scenes/ViewScheules";
import CreateSchedule from "./scenes/CreateSchedule";
import Calendar from "./scenes/calendar";
import DroneStatistics from "./components/DroneStatistics";
import TrackDrone from "./scenes/trackDrone";
import CreateMission from "./scenes/createMission";
import AddMapForm from "./scenes/addMap";
import GetAllMissions from "./scenes/getMissions";
import GetAllMaps from "./scenes/getFarmMaps";
import VideoDashboard from './scenes/upload/VideoDashboard';
import Upload from './scenes/upload/VideoUpload';
import MissionPlanner from './scenes/MissionPlanner'

import './App.css';


export function ViewDashboard() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app2">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                {/* <Routes>
                  <Route path="/" element={<Dashboard />} />
                </Routes> */}
                <Dashboard />
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function TrackingDashboardPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app2">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                {/* <Routes>
                  <Route path="/" element={<Dashboard />} />
                </Routes> */}
                <TrackingDashboard />
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function TrackingDronePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app2">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                {/* <Routes>
                  <Route path="/" element={<Dashboard />} />
                </Routes> */}
                <TrackingDrone />
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function ConfigureTrackingPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app2">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                {/* <Routes>
                  <Route path="/" element={<Dashboard />} />
                </Routes> */}
                <Dashboard />
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


export function ViewDronePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<ViewDrone />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function EditDronePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<EditDrone />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


export function CreateDronePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<CreateDrone />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function ViewDroneStatistics() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<DroneStatistics />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function TrackDronePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<TrackDrone />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function ViewSchedulePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<ViewSchedule />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function CreateSchedulePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<CreateSchedule />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function EditSchedulePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<EditSchedule />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function ViewBar() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<Bar />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function ViewPie() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<Pie />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function ViewLine() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<Line />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function ViewFaq() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<FAQ />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function ViewGeography() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<Geography />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function ViewContacts() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<Contacts />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function ViewCalendar() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<Calendar />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
export function CreateMissionPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<CreateMission />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function CreateMapPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<AddMapForm />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function GetMissionsPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<GetAllMissions />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function GetFarmsPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<GetAllMaps />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function UploadPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<Upload/>} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function GetVideoDashboard() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<VideoDashboard />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function ViewMissionPlanner() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app3">
          <div className="main-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="content-container">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Routes>
                  <Route path="/" element={<MissionPlanner />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}