import React, {useState, useEffect} from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import DeleteAllMissionPlans from "../deleteAllMissions";
import DeleteMissionById from "../deleteMissionById";
import TenantIdSingleton from "../../components/TenantId"
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { BASE_URL, API_ENDPOINTS } from '../../../config';

function GetAllMissions() {
    
    const [missions, setMissions] = useState([{}]);
    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
    const TenantId=userdetails.email;
    const [docs, setDocs] = useState([]);
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    
    useEffect(() => {
        fetch(`${BASE_URL}${API_ENDPOINTS.getAllMissionPlans}/${TenantId}`)
        .then(res => res.json())
        .then(data => {setMissions(data)});
    }, []);
    

    const displayMissionPlans = missions.map((info) => {
        return (
            <tr>
                <td>{info.MissionId}</td>
                <td>{info.MissionType}</td>
                <td>{info.Location}</td>
                <td>{info.FlightHeight}</td>
                <td>{info.Alerts}</td>
            </tr>
        )
    })

    const sendRequest = async () => {
        const res = await axios.get(
            `${BASE_URL}${API_ENDPOINTS.getAllMissionPlans}/${TenantId}`
        );
        console.log('Data received from backend:', res.data);
        return res.data;
      };

      useEffect(() => {
        console.log("getting data");
        async function fetchData() {
          const data = await sendRequest();
          const formattedData = data.map((item) => {
            const { _id, __v, ...rest } = item;
            return {
              ...rest
            };
          });
          setDocs(formattedData);
          console.log('Formatted data:', formattedData);
        }
        fetchData();
      }, []);

    const deleteDrone = async (id) => {
        try {
          const response = await axios.delete(
            `${BASE_URL}${API_ENDPOINTS.getDrones}/${id}`,
            { withCredentials: true }
          );
          console.log("Drone deleted successfully:", response.data);
          setDocs(docs.filter((doc) => doc.drone_id !== id));
        } catch (error) {
          console.error("Error deleting drone:", error);
        }
      };
      
      const handleEdit = (row) => {
        console.log("Edit clicked for drone_id:", row.drone_id);
        navigate('/dashboard/editDrone', { state: { drone_info: row } });
      };
      
      
      const handleDelete = async (id) => {
        console.log("Delete clicked for drone_id:", id);
        await deleteDrone(id);
      };

      console.log("shakshi:",docs);
      console.log("shakshi2:",missions);

    const columns = [
        { field: "MissionId", headerName: "MissionId" },
        {
          field: "MissionType",
          headerName: "Mission Type",
          flex: 1,
          cellClassName: "name-column--cell",
        },
        {
          field: "Location",
          headerName: "Location",
          flex: 1,
          cellClassName: "name-column--cell",
        },
        {
          field: "FlightHeight",
          headerName: "Flight Height",
          flex: 1,
        },
        {
          field: "Alerts",
          headerName: "Alerts",
          flex: 1,
        },    
      ];
    
      return (
        <Box m="20px">
          <Header title="All Mission Plans" />
          {docs.length > 0 ?
            <Box
              m="40px 0 0 0"
              height="75vh"
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                },
                "& .name-column--cell": {
                  color: colors.greenAccent[700],
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: colors.blueAccent[300],
                  borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: colors.primary[600],
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: colors.blueAccent[300],
                },
                "& .MuiCheckbox-root": {
                  color: `${colors.greenAccent[200]} !important`,
                },
              }}
            >
              <DataGrid checkboxSelection rows={docs} columns={columns} getRowId={(row) => row.MissionId} />
            </Box>
            :
            <Typography>Loading...</Typography>
          }
            <br />
            <br />
            <h1>Manage Mission Plans:</h1>
            <br />
            <DeleteAllMissionPlans />
            <br />
            <br />
            <DeleteMissionById />
        </Box>
        
      );
    };

export default GetAllMissions;