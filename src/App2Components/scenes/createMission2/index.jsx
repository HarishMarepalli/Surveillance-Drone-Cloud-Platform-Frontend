import React, {useState, useEffect} from "react";
import axios from "axios";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import Map from "../ggleMapRender/Map";
import TenantIdSingleton from "../../components/TenantId";
import { BASE_URL, API_ENDPOINTS } from '../../../config';

function CreateMission() {

    const navigate = useNavigate();

    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
    const TenantId=userdetails.email;
    
    const [inputData, setInputData] = useState({
        TenantId: TenantId,
        MissionId:"",
        MissionType: "",
        Location:"",
        FlightPlanCooridnates:"",
        FlightHeight: "",
        Alerts:""
        
    });


    const [maps, setMaps] = useState([{}]);
    const [coords,setCoords]=useState(null);
    console.log("Co-ords from child:",coords);


    const handleChange=(e)=>{
        console.log(e)
        setInputData((prev)=>({
            ...prev,
            [e.target.name]:e.target.value,
        }))
        if(e.target.name==="Location"){
            let maps=JSON.parse(window.sessionStorage.getItem("maps"));
            const activemap=maps.filter(map=> e.target.value==map.Name);
            console.log("AM:",activemap)
            setCoords({lat:activemap[0].Lat,lng:activemap[0].Long});
            console.log("C:",coords)
        }
    }


    useEffect(() => {
        fetch(`${BASE_URL}${API_ENDPOINTS.getAllMaps}/${TenantId}`)
        .then(res => res.json())
        .then(data => {setMaps(data); console.log("MAPS:",data);window.sessionStorage.setItem("maps",JSON.stringify(data));});
    }, []);
    useEffect(()=>{

    },[coords])


    const sendRequest = async() => {
        await axios.post(`${BASE_URL}${API_ENDPOINTS.createMissionPlan}`,{
            TenantId: inputData.TenantId,
            MissionId:inputData.MissionId,
            MissionType:inputData.MissionType,
            Location:inputData.Location,
            FlightPlanCoordinates: coords,
            FlightHeight: inputData.FlightHeight,
            Alerts: inputData.Alerts
        })
        .then((res) => {
            console.log(res);
        })
        .catch(err=>console.log(err));
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputData);
        sendRequest().then(()=>alert("Added mission plan to db!"))
        .then(() => navigate("/dashboard"));
    }


    return (
        <Box m="20px">
            <Header title="Create New Mission Plan" />
                <Formik
                    onSubmit={handleSubmit}
                >
                    <form onSubmit={handleSubmit}>
                        <label>Specify mission id:</label>
                        <input type="text" name="MissionId" value={inputData.MissionId} onChange={handleChange} />
                        <label>Select mission service:</label>
                        <select name='MissionType' value={inputData.MissionType} onChange={handleChange}>
                            <option disabled={true} value="">Choose Mission</option>
                            <option value={"Spraying"}>Spraying</option>
                            <option value={"Soil Sampling"}>Soil Sampling</option>
                            <option value={"Crop Health Scout"}>Crop Health Scout</option>
                            <option value={"Trench Patrol"}>Trench Patrol</option>
                            <option value={"Infrastructure Scout"}>Infrastructure Scout</option>
                        </select>
                        <br />
                        <br />
                        <label>Select service location:</label>
                        <select name='Location' value={inputData.Location} onChange={handleChange}>
                            <option disabled={true} value="">Choose Location</option>
                            {maps.map((maps) => {
                                return (<option key={maps.id} value={maps.id}>{maps.Name}</option>)
                            })}
                        </select>
                        <br />
                        <br />
                        <label>Specify mission flight height:</label>
                        <input type="text" name="FlightHeight" value={inputData.FlightHeight} onChange={handleChange} />
                        <br />
                        <button type="submit">Create Mission Plan</button>
                    </form>
                </Formik>
                <Map center={coords}/>
        </Box>
    )
}

export default CreateMission;