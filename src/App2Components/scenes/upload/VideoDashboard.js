import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Header from "../../components/Header";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from "@mui/material";
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

    const videos = this.state.videoList.map(video => {
      return (
        <div className="video-link" key={video._id}>
          <p>Mission Id</p>
          <p>{video.mission}</p>
          <p>Time</p>
          <p>{video.createdAt}</p>
          <Link variant to={`${BASE_URL}${API_ENDPOINTS.getVideos}/` + video.upload_title + ".mp4"}>
          {video.upload_title.replace(/_/g, ' ')}
          </Link>
          <br/>
        </div>
      );
    });

    return (
        <div className="container mt-5">
          <Header title="Video" />
          <div className="video-list">
            {videos}
          </div>
        </div>
    );
  }
}

export default VideoDashboard;