import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import {Box} from "@mui/material";
import {Formik} from "formik";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import TenantIdSingleton from '../../components/TenantId';
import Map1 from '../ggleMapRender/Map1';
import { BASE_URL, API_ENDPOINTS } from '../../../config';

function AddMapForm() {

    

    const navigate = useNavigate();
    
    const [location,setLocation]=React.useState({lat:null,lng:null});
    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
    const TenantId=userdetails.email;

    const [inputData, setInputData] = useState({
        TenantId: TenantId,
        Name:"",
        Address: "",
        Lat: location?.lat,
        Long: location?.lng
    });

    useEffect(()=>{

    },[location])


    const handleChange = (e) => {
        setInputData((prev) => ({
            ...prev,
            [e.target.name]:e.target.value,
        }))
    }


    const sendRequest = async() => {
        await axios.post(`${BASE_URL}${API_ENDPOINTS.addMap}`, {
            TenantId: inputData.TenantId,
            Name: inputData.Name,
            Address: inputData.Address,
            Lat: location.lat,
            Long: location.lng
        })
        .then((res) => {console.log(res);})
        .catch(err => console.log(err));
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(inputData);
        sendRequest().then(() => alert("Added map succesfully!!"))
        // console.log(inputData.TenantId);
        //.then(() => navigate("/dashboard"));
    };

    
    return (
        <Box m="20px">
            <Header title="Add New Map" />
                <Formik onSubmit={handleSubmit}>
                    <form onSubmit={handleSubmit}>
                        <label for="Name">Map Name:</label>
                        <input type="text" id="Name" name="Name" value={inputData.Name} onChange={handleChange} /><br />
                        <br />
                        <label for="Address">Map Address:</label>
                        <input type="text" id="Address" name="Address" value={inputData.Address} onChange={handleChange} /><br />
                        <br />
                        <p><b>PLease specify map location coordinates:</b></p>
                        <label for="Lat">Latitude</label>
                        <input type="text" id="Lat" name="Lat" value={location.lat} onChange={handleChange} />
                        <br />
                        <label for="Long">Longitude</label>
                        <input type="text" id="Long" name="Long" value={location.lng} onChange={handleChange} />
                        <br />
                        <input type="submit" value="Add New Map" />
                        <Map1 location={location} setLocation={setLocation}/>
                    </form>
                </Formik>
        </Box>
    )
}

export default AddMapForm;