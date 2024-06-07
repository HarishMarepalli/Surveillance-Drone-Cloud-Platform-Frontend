import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { BASE_URL, API_ENDPOINTS } from '../../../config';


const EditDrone = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const location = useLocation();
  const drone_info = location.state.drone_info;
  const initialValues = {
    DroneId: drone_info.drone_id, // Replace with the fetched drone data
    Name: drone_info.name,
    Manufacturer: drone_info.manufacturer,
    ModelNumber: drone_info.model_number,
    Price: drone_info.price,
  };

  // Fetch the drone data with the given id
  // ...

  const handleFormSubmit = (values) => {
    console.log(values);
    updateRequest(values).then(() => navigate("/dashboard/viewDrone"));
  };

  const updateRequest = async (values) => {
    const res = await axios.put(`${BASE_URL}${API_ENDPOINTS.getDrones}/${values.DroneId}`, {
      drone_id: values.DroneId,
      name: values.Name,
      manufacturer: values.Manufacturer,
      model_number: values.ModelNumber,
      price: values.Price,
    }, { withCredentials: true }).catch(err => console.log(err))
    const data = await res.data;
    return data;
  }

  return (
    <Box m="20px">
      <Header title="Edit Drone" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues} // Replace with the fetched drone data
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
            <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Drone ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.DroneId}
                name="DroneId"
                error={!!touched.DroneId && !!errors.DroneId}
                helperText={touched.DroneId && errors.DroneId}
                sx={{ gridColumn: "span 4" }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Drone Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Name}
                name="Name"
                error={!!touched.Name && !!errors.Name}
                helperText={touched.Name && errors.Name}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Manufacturer"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Manufacturer}
                name="Manufacturer"
                error={!!touched.Manufacturer && !!errors.Manufacturer}
                helperText={touched.Manufacturer && errors.Manufacturer}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Model Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ModelNumber}
                name="ModelNumber"
                error={!!touched.ModelNumber && !!errors.ModelNumber}
                helperText={touched.ModelNumber && errors.ModelNumber}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Price}
                name="Price"
                error={!!touched.Price && !!errors.Price}
                helperText={touched.Price && errors.Price}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Drone
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  DroneId: yup.string().required("required"),
  Name: yup.string().required("required"),
  Manufacturer: yup.string().required("required"),
  ModelNumber: yup.string().required("required"),
  Price: yup.string().required("required"),
});



export default EditDrone;
