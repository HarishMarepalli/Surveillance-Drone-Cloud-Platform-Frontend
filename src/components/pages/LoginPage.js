import React, { useState } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography, useTheme } from "@mui/material";
import axios from 'axios';
import { tokens } from "../../App2Components/theme";
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import Header from "../../App2Components/components/Header";
import { async } from 'q';
import TenantIdSingleton from '../../App2Components/components/TenantId';
import { BASE_URL, API_ENDPOINTS } from '../../config';
import * as yup from "yup";
import { Formik } from "formik";
import Snackbar from '@mui/material/Snackbar';

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;
  const [snackbarMsg, setSnackbarMsg] = React.useState('');

  const initialValues = {
    Email: "",
    Password: ""
  };

  const checkoutSchema = yup.object().shape({
    Email: yup.string().required("Required"),
    Password: yup.string().required("Required")
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(`Email: ${email}, Password: ${password}`);
    // Perform authentication here, and handle routing upon successful authentication.
    sendRequest().then(async()=>{
      const res=await axios.get(
        `${BASE_URL}${API_ENDPOINTS.getUserProfile}/${email}`
      );
      // console.log("USER DETAILS:",res.data.user);
      TenantIdSingleton.id = email;
      Object.freeze(TenantIdSingleton);
      // res.data.user.email = "marepalliharish@gmail.com";
      // res.data.user.lastname = "Marepalli";
      window.sessionStorage.setItem("userdetails",JSON.stringify(res.data.user));
      //window.localStorage.setItem("page","Dashboard");
      navigate("/dashboard");
    });
  };

  const handleRegister = () => {
    navigate("/register");
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setState({ ...state, open: false });
  };

  const handleFormSubmit = (values) => {
    //e.preventDefault();
    // console.log(`Email: ${email}, Password: ${password}`);
    // Perform authentication here, and handle routing upon successful authentication.
    sendRequest(values).then(async(data)=>{
      // console.log(data);
      const res=await axios.get(
        `${BASE_URL}${API_ENDPOINTS.getUserProfile}/${values.Email}`
      );
      // console.log("USER DETAILS:",res.data.user);
      // TenantIdSingleton.id = email;
      // Object.freeze(TenantIdSingleton);
      // res.data.user.email = "marepalliharish@gmail.com";
      // res.data.user.lastname = "Marepalli";
      setSnackbarMsg(data.message);
      setState({ ...state, open: true });
      setTimeout(()=> {
        window.sessionStorage.setItem("userdetails",JSON.stringify(res.data.user));
        //window.localStorage.setItem("page","Dashboard");
        navigate("/dashboard");
      }, 1000)
    });
  };

  const sendRequest=async (values)=>{
      const res=await axios.post(`${BASE_URL}${API_ENDPOINTS.login}`,{
          email:values.Email,
          password:values.Password,
      },{withCredentials: true}).catch((err)=>{
        setSnackbarMsg(err.response.data.message);
        setState({ ...state, open: true });
      })
      const data=await res.data;
      // console.log(data);
      return data;
  }

  return (
    // <div className="login-container" style={{marginTop: "5em"}}>
    //   <h2 style={{color: "#000"}}>Login</h2>
    //   <form onSubmit={handleSubmit}>
    //     <div className="input-group">
    //       <label htmlFor="email">Email:</label>
    //       <input
    //         type="email"
    //         id="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div className="input-group">
    //       <label htmlFor="password">Password:</label>
    //       <input
    //         type="password"
    //         id="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <button id='loginBtn' type="submit">Login</button>
    //   </form>
    // </div>
    <Box 
      m="20px"
      height="40vw"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
          width="80%"
          display="flex"
          margin="auto"
          backgroundColor={theme.palette.neutral.light}
          padding="2em"
          borderRadius="20px"
          boxShadow="0px 0px 13px 0px rgba(96,125,139,0.89)"
          sx={{
              "& .MuiInputLabel-root": {
                  color: theme.palette.neutral.dark,
                  fontSize: "1.2rem",
              },
              "& .Mui-focused.MuiInputLabel-root": {
                  color: theme.palette.neutral.dark,
                  fontWeight: "bold"
              },
              "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.mode == "light" ? colors.grey[200] : colors.grey[800]
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.neutral.dark
              },
              "& .MuiOutlinedInput-root":{
                  fontSize: "1.2rem"
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: '#ddd'
              }
          }}
      >
          <Box
          >
            <img 
                src="../../../images/dronebg1.jpg" 
                alt="Drone" 
                width="800" 
                height="600"
                style={{
                  // filter: "drop-shadow(0 0 0.1rem #fff)",
                  // animation: "pulse 1s infinite alternate"
                  borderRadius: '20px'
                }}
            />
          </Box>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
          >
              {({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
              }) => (
                  <form 
                    onSubmit={handleSubmit}
                    style={{
                      width: "-webkit-fill-available",
                      padding: "6em",
                      margin: "auto"
                      // display: "flex",
                      // flexDirection: "column",
                      // justifyContent: "center"
                    }}
                  >
                      <Header title="Sign-In" />
                      <FormControl className="form-control" fullWidth>
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="text"
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.Email}
                            name="Email"
                            error={!!touched.Email && !!errors.Email}
                            helperText={touched.Email && errors.Email}
                            sx={{ marginBottom: "20px" }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="password"
                            label="Password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.Password}
                            name="Password"
                            error={!!touched.Email && !!errors.Email}
                            helperText={touched.Email && errors.Email}
                            sx={{ marginBottom: "20px" }}
                      />
                      </FormControl>
                      <Box
                          display="flex"
                          justifyContent="center"
                          marginTop="1em"
                          sx={{
                              "& .MuiButton-root": {
                                  transition: "transform ease-in 0.1s"
                              },
                              "& .MuiButton-root:hover":{
                                  backgroundColor: theme.palette.secondary.light,
                                  transform: "scale(1.1)"
                              }
                          }}
                      >
                          <Button 
                              type="submit" 
                              className="button-submit" 
                              color="secondary" 
                              variant="contained"
                              sx={{
                                  fontSize:"1rem",
                                  fontWeight:"bold",
                                  //borderRadius:"15px"
                              }}
                          >
                              Login
                          </Button>
                      </Box>
                      <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          marginTop="5em"
                          border="1px solid #ccc"
                          padding="2em"
                          sx={{
                              "& .MuiButton-root": {
                                  transition: "transform ease-in 0.1s"
                              },
                              "& .MuiButton-root:hover":{
                                  backgroundColor: theme.palette.secondary.light,
                                  transform: "scale(1.1)"
                              }
                          }}
                      >
                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            // sx={{ color: colors.grey[900] }}
                            color={theme.palette.neutral.dark}
                        >
                          Do not have an account?
                        </Typography>
                          <Button 
                              className="button-submit" 
                              color="secondary" 
                              variant="contained"
                              onClick={handleRegister}
                              sx={{
                                  fontSize:"1rem",
                                  fontWeight:"bold",
                                  //borderRadius:"15px"
                              }}
                          >
                              Register
                          </Button>
                      </Box>
                  </form>
              )}
          </Formik>
      </Box>
      <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            message={snackbarMsg}
            key={vertical + horizontal}
            sx={{
                "& .MuiSnackbarContent-root":{
                    backgroundColor: theme.palette.secondary.light,
                },
                "& .MuiSnackbarContent-message" : {
                    fontSize: '1.3em',
                    fontWeight: 'bold',
                    color: theme.palette.neutral.light
                }
            }}
        />
  </Box>
  );
};

export default LoginPage;
