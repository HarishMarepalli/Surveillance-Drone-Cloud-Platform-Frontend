import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { BASE_URL, API_ENDPOINTS } from '../../../config';

import './Dashboard.css';

class VideoDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoList: []
    }
  }

  componentDidMount() {
    if (true) {
      axios.get(`${BASE_URL}${API_ENDPOINTS.videoList}`, {
      }).then(res => {
        this.setState({
          videoList: res.data
        });
      });
    }
  }

  render() {
    const { videoList } = this.state;
    const theme = this.props.theme; // assuming the theme is passed as a prop
    const colors = tokens(theme.palette.mode);

    const videos = videoList.map(video => {
      return (
        <div className="" key={video._id}>
          <Link to={`${BASE_URL}${API_ENDPOINTS.getVideos}/` + video.upload_title + ".mp4"}>
          {video.upload_title.replace(/_/g, ' ')}
          </Link>
          <br/>
        </div>
      );
    });

    const columns = [
      { field: "upload_title", headerName: "VideoName" },
    ];
  
    return (
      <Box m="20px">
        <Header title="View Drone" />
        {videos.length > 0 ?
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
            <DataGrid checkboxSelection rows={videos} columns={columns} getRowId={(row) => row._id} />
          </Box>
          :
          <Typography>Loading...</Typography>
        }
      </Box>
    );
  }
}

export default VideoDashboard;
