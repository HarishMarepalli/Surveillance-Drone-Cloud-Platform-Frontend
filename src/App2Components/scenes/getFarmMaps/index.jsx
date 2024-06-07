import React, {useState,useEffect} from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import DeleteAllMaps from "../deleteAllMaps";
import DeleteFarmMap from "../deleteMapByName";
import TenantIdSingleton from "../../components/TenantId";
import axios from "axios";
import Map from '../ggleMapRender/Map';
import { useNavigate } from 'react-router-dom';
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { BASE_URL, API_ENDPOINTS } from '../../../config';


function GetAllMaps() {

  const [maps, setMaps] = useState([]);
  let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
  const TenantId=userdetails.email;
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetch = async() => {
      const getMaps = await axios.get(`${BASE_URL}${API_ENDPOINTS.getAllMaps}/${TenantId}`);
      setMaps(getMaps.data);
      console.log("MAPS",getMaps.data);
    };
    fetch();
  }, []);

  console.log("shakhsi:",maps);

  const columns = [
    { field: "_id", headerName: "ID", hide: true },
    { field: "Name", headerName: "MapName" },
    {
      field: "Address",
      headerName: "Address",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "Lat",
      headerName: "Latitude",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "Long",
      headerName: "Longitude",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="Location Maps" />
      {maps.length > 0 ? (
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
          <DataGrid
            checkboxSelection
            rows={maps}
            columns={columns}
            getRowId={(row) => row._id}
          />
        </Box>
      ) : (
        <Typography>Loading...</Typography>
      )}
      <br />
      <br />
      <h1>Manage Maps:</h1>
      <br />
      <DeleteAllMaps />
      <br />
    </Box>
  );
}

export default GetAllMaps;
