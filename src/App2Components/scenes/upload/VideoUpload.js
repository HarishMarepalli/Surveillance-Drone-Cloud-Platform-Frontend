import React from 'react';
import axios from 'axios';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import Header from "../../components/Header";
import { Box, Button, TextField } from "@mui/material";

import 'react-toastify/dist/ReactToastify.css';
import './Upload.css';
import { BASE_URL, API_ENDPOINTS } from '../../../config';

class Upload extends React.Component {
  state = {
    selectedVideos: null,
    loaded: 0
  }

  maxSelectFile(event) {
    let files = event.target.files;
    if (files.length > 1) {
      toast.error('Maximum 1 file is allowed');
      event.target.value = null;
      return false;
    } else {
      let err = '';
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 52428800) { // 50 MB
          err += files[i].name + ', ';
        }
      }
      if (err !== '') {
        // error caught
        event.target.value = null;
        toast.error(err + " is/are too large. Please select file size < 50Mb");
      }
    }
    return true;
  }

  fileChangeHandler(event) {
    const files = event.target.files;
    if (this.maxSelectFile(event)) {
      this.setState({
        selectedVideos: files,
        loaded: 0
      });
    }
  }

  fileUploadHandler(event) {
    const data = new FormData();
    for (let i = 0; i < this.state.selectedVideos.length; i++) {
      data.append('file', this.state.selectedVideos[i]);
    }
    axios.post(`${BASE_URL}${API_ENDPOINTS.videoUpload}`, data, {
    }, {
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total * 100)
        });
      }
    }).then(res => {
      toast.success('Upload Successful');
    }).catch(err => {
      toast.error(`Upload Fail with status: ${err.statusText}`);
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="container mt-5">
          <div className="form-group">
            <ToastContainer />
          </div>
          <Header title="Add New Video" />
          <hr className="my-4" />

          <form method="post" name="videoUpload" action="/api/upload" id="#" encType="multipart/form-data">
            <div className="form-group files">
              <label>Upload Your Videos Here</label>
              <input
                type="file"
                name="file"
                className="form-control"
                multiple="multiple"
                accept="video/*"
                onChange={this.fileChangeHandler.bind(this)} />
              {/* <Progress max="100" color="success" value={this.state.loaded} className="mt-4 mb-1">
                {isNaN(Math.round(this.state.loaded, 2)) ? 0 : Math.round(this.state.loaded, 2)}%
              </Progress> */}
              <button
                type="button"
                className="btn btn-success btn-block"
                onClick={this.fileUploadHandler.bind(this)}>Upload Video
              </button>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Upload;