import React, { useState } from 'react';
import './RegisterPage.css';
import axios from 'axios';
import { tokens } from "../../App2Components/theme";
import Header from "../../App2Components/components/Header";
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography, useTheme } from "@mui/material";
import { BASE_URL, API_ENDPOINTS } from '../../../src/config';
import * as yup from "yup";
import { Formik } from "formik";
import Snackbar from '@mui/material/Snackbar';

const RegisterPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;
  const [snackbarMsg, setSnackbarMsg] = React.useState('');

  const initialValues = {
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    Role: "",
    Contact: "",
    Location: "",
    Gender: "",
    Age: "",
  };

  const checkoutSchema = yup.object().shape({
    Email: yup.string().required("Required"),
    Password: yup.string().required("Required"),
    FirstName: yup.string().required("Required"),
    LastName: yup.string().required("Required"),
    Role: yup.string().required("Required"),
    Contact: yup.string().required("Required"),
    Location: yup.string().required("Required"),
    Gender: yup.string().required("Required"),
    Age: yup.number().required("Required"),
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setState({ ...state, open: false });
  };

  const handleLogin = () => {
    navigate("/login");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(`Name: ${firstname}, Email: ${email}, Password: ${password}`);
    // Perform registration logic here, and handle routing upon successful registration.
    sendRequest().then(()=>navigate("/login"));
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    sendRequest(values)//.then(()=>navigate("/login"));
  };

  const sendRequest=async (values)=>{
      const res=await axios.post(`${BASE_URL}${API_ENDPOINTS.signUp}`,{
          firstname:values.FirstName,
          lastname:values.LastName,
          email:values.Email,
          password:values.Password,
          role:values.Role,
          contact:values.Contact,
          location:values.Location,
          gender:values.Gender,
          age:values.Age
      },{withCredentials: true}).catch(err=>console.log(err))
      const data=await res.data;
      // console.log(data);
      setSnackbarMsg(data.message);
      setState({ ...state, open: true });
      setTimeout(()=> {
        navigate("/login")
      }, 1000)
      return data;
  }

  return (
    // <div className="register-container">
    //   <h2>Register</h2>
    //   <form onSubmit={handleSubmit}>
    //     <div className="input-group">
    //       <label htmlFor="firstname">First Name:</label>
    //       <input
    //         type="text"
    //         id="firstname"
    //         value={firstname}
    //         onChange={(e) => setFirstName(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div className="input-group">
    //       <label htmlFor="lastname">Last Name:</label>
    //       <input
    //         type="text"
    //         id="lastname"
    //         value={lastname}
    //         onChange={(e) => setLastName(e.target.value)}
    //         required
    //       />
    //     </div>
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
    //     <div className="input-group">
    //       <label htmlFor="role">Role:</label>
    //       <input
    //         type="text"
    //         id="role"
    //         value={role}
    //         onChange={(e) => setRole(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div className="input-group">
    //       <label htmlFor="contact">Contact:</label>
    //       <input
    //         type="text"
    //         id="contact"
    //         value={contact}
    //         onChange={(e) => setContact(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div className="input-group">
    //       <label htmlFor="location">Loacation:</label>
    //       <input
    //         type="text"
    //         id="location"
    //         value={location}
    //         onChange={(e) => setLocation(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div className="input-group">
    //       <label htmlFor="gender">Gender:</label>
    //       <input
    //         type="text"
    //         id="gender"
    //         value={gender}
    //         onChange={(e) => setGender(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div className="input-group">
    //       <label htmlFor="age">Age:</label>
    //       <input
    //         type="text"
    //         id="age"
    //         value={age}
    //         onChange={(e) => setAge(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <button id='registerBtn' type="submit">Register</button>
    //   </form>
    // </div>
    <Box 
      m="20px"
      height="30vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
          width="80%"
          display="flex"
          margin="auto"
          backgroundColor={theme.palette.neutral.light}
          padding="4em"
          paddingTop="0"
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
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <img 
                src="../../../images/img-2.jpg" 
                alt="Drone" 
                width="800" 
                height="800"
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
                      padding: "5em",
                      margin: "auto"
                      // display: "flex",
                      // flexDirection: "column",
                      // justifyContent: "center"
                    }}
                  >
                      <Header title="Sign-Up" />
                      <FormControl className="form-control" fullWidth>
                      <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          label="FirstName"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.FirstName}
                          name="FirstName"
                          error={!!touched.FirstName && !!errors.FirstName}
                          helperText={touched.FirstName && errors.FirstName}
                          sx={{ marginBottom: "20px" }}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          label="LastName"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.LastName}
                          name="LastName"
                          error={!!touched.LastName && !!errors.LastName}
                          helperText={touched.LastName && errors.LastName}
                          sx={{ marginBottom: "20px" }}
                        />
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
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          label="Role"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Role}
                          name="Role"
                          error={!!touched.Role && !!errors.Role}
                          helperText={touched.Role && errors.Role}
                          sx={{ marginBottom: "20px" }}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          label="Contact"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Contact}
                          name="Contact"
                          error={!!touched.Contact && !!errors.Contact}
                          helperText={touched.Contact && errors.Contact}
                          sx={{ marginBottom: "20px" }}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          label="Location"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Location}
                          name="Location"
                          error={!!touched.Location && !!errors.Location}
                          helperText={touched.Location && errors.Location}
                          sx={{ marginBottom: "20px" }}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          label="Gender"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Gender}
                          name="Gender"
                          error={!!touched.Gender && !!errors.Gender}
                          helperText={touched.Gender && errors.Gender}
                          sx={{ marginBottom: "20px" }}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          label="Age"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Age}
                          name="Age"
                          error={!!touched.Age && !!errors.Age}
                          helperText={touched.Age && errors.Age}
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
                              Register
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
                          Already have an account?
                        </Typography>
                          <Button 
                              className="button-submit" 
                              color="secondary" 
                              variant="contained"
                              onClick={handleLogin}
                              sx={{
                                  fontSize:"1rem",
                                  fontWeight:"bold",
                                  //borderRadius:"15px"
                              }}
                          >
                              Login
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

export default RegisterPage;
