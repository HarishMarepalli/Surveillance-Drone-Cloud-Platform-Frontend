import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
// can use API Here instead of Mockdata
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from 'date-fns';
import { BASE_URL, API_ENDPOINTS } from '../../../config';


const ViewSchedules = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);

  const sendRequest = async () => {
    const res = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.viewSchedules}`,
      { withCredentials: true }
    );
    console.log('Data received from backend:', res.data);
    return res.data;
  };

  const deleteSchedule = async (id) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}${API_ENDPOINTS.getSchedules}/${id}`,
        { withCredentials: true }
      );
      console.log("Drone deleted successfully:", response.data);
      setDocs(docs.filter((doc) => doc.schedule_id !== id));
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };
  
  const handleEdit = async (row) => {
    console.log("Edit clicked for schedule_id:", row.schedule_id);
    navigate('/dashboard/editSchedule', { state: { schedule_info: row } });
  };
  
  
  const handleDelete = async (id) => {
    console.log("Delete clicked for schedule_id:", id);
    await deleteSchedule(id);
  };
  
  useEffect(() => {
    async function fetchData() {
      const data = await sendRequest();
      const formattedData = data.map((item) => {
        const { _id, __v, ...rest } = item;
        return {
          ...rest,
          start_time: format(new Date(item.start_time), 'yyyy/MM/dd HH:mm:ss'),
          end_time: format(new Date(item.end_time), 'yyyy/MM/dd HH:mm:ss'),
        };
      });
      setDocs(formattedData);
      console.log('Formatted data:', formattedData);
    }
    fetchData();
  }, []);
  
  
  

  const columns = [
    { field: "schedule_id", headerName: "ScheduleId" },
    {
      field: "start_time",
      headerName: "Start Time",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "end_time",
      headerName: "End Time",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "mission_id",
      headerName: "Mission ID",
      flex: 1,
    },
    {
      field: "drone_id",
      headerName: "Drone ID",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDelete(params.row.schedule_id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },    
  ];

  return (
    <Box m="20px">
      <Header title="View Schedules" />
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
          <DataGrid checkboxSelection rows={docs} columns={columns} getRowId={(row) => row.schedule_id} />
        </Box>
        :
        <Typography>Loading...</Typography>
      }
    </Box>
  );
};

export default ViewSchedules;
