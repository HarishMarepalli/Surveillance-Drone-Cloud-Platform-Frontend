import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route } from "react-router-dom";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import TrackingDashboard from "./scenes/trackingDashboard";
import TrackingConfiguration from "./scenes/trackingConfiguration";
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
import ViewMissions from "./scenes/viewMissions";
import ModifyMission from "./scenes/modifyMission";
import MissionDashboard from "./scenes/missionDashboard";
import AddMapForm from "./scenes/addMap";
import GetAllMissions from "./scenes/getMissions";
import GetAllMaps from "./scenes/getFarmMaps";
import VideoDashboard from './scenes/upload/VideoDashboard';
import Upload from './scenes/upload/VideoUpload';
import MissionPlanner from './scenes/MissionPlanner'

import './App.css';


export function ViewDashboard({setSelected}) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  setSelected("Dashboard");
  //window.localStorage.setItem("page","Dashboard");
  return (
    <main className="content">
      {/* <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes> */}
      <Dashboard />
    </main>     
  );
}

export function TrackingDashboardPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <main className="content">
      {/* <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes> */}
      <TrackingDashboard />
    </main>
  );
}

export function TrackingDronePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <main className="content">
      {/* <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes> */}
      <TrackingDrone />
    </main>
  );
}

export function ConfigureTrackingPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <main className="content">
    {/* <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes> */}
    <TrackingConfiguration />
    </main>
  );
}


export function ViewDronePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <main className="content">
      <Routes>
        <Route path="/" element={<ViewDrone />} />
      </Routes>
    </main>
  );
}

export function EditDronePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<EditDrone />} />
    </Routes>
  </main>
  );
}


export function CreateDronePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<CreateDrone />} />
    </Routes>
  </main>
  );
}

export function ViewDroneStatistics() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<DroneStatistics />} />
    </Routes>
  </main>
  );
}

export function TrackDronePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<TrackDrone />} />
    </Routes>
  </main>
  );
}

export function ViewSchedulePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<ViewSchedule />} />
    </Routes>
  </main>
  );
}

export function CreateSchedulePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<CreateSchedule />} />
    </Routes>
  </main>
  );
}

export function EditSchedulePage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<EditSchedule />} />
    </Routes>
    </main>
  );
}

export function ViewBar() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<Bar />} />
    </Routes>
  </main>
  );
}

export function ViewPie() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<Pie />} />
    </Routes>
  </main>
  );
}

export function ViewLine() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<Line />} />
    </Routes>
  </main>
  );
}

export function ViewFaq() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<FAQ />} />
    </Routes>
  </main>
  );
}

export function ViewGeography() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<Geography />} />
    </Routes>
  </main>
  );
}

export function ViewContacts() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<Contacts />} />
    </Routes>
  </main>
  );
}

export function ViewCalendar() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<Calendar />} />
    </Routes>
  </main>
  );
}
export function CreateMissionPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<CreateMission />} />
    </Routes>
  </main>
  );
}

export function CreateMapPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<AddMapForm />} />
    </Routes>
  </main>
  );
}

export function GetMissionsPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<GetAllMissions />} />
    </Routes>
  </main>
  );
}

export function GetFarmsPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<GetAllMaps />} />
    </Routes>
  </main>
  );
}

export function UploadPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<Upload/>} />
    </Routes>
  </main>
  );
}

export function GetVideoDashboard() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<VideoDashboard />} />
    </Routes>
  </main>
  );
}

export function ViewMissionPlanner({setSelected}) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <main className="content">
    <Routes>
      <Route path="/" element={<MissionPlanner setSelected={setSelected}/>} />
    </Routes>
  </main>
  );
}

export function ViewMissionsPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <main className="content">
    {/* <Routes>
      <Route path="/" element={<ViewMissions />} />
    </Routes> */}
      <ViewMissions />
  </main>
  );
}

export function ModifyMissionPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <main className="content">
      {/* <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes> */}
      <ModifyMission />
    </main>
  );
}

export function MissionDashboardPage({setSelected}) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <main className="content">
      {/* <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes> */}
      <MissionDashboard setSelected={setSelected}/>
    </main>
  );
}