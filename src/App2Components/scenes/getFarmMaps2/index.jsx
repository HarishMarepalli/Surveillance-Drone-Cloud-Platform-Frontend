import React, {useState,useEffect} from "react";
import {Box} from "@mui/material";
import Header from "../../components/Header";
import DeleteAllMaps from "../deleteAllMaps";
import DeleteFarmMap from "../deleteMapByName";
import TenantIdSingleton from "../../components/TenantId";
import axios from "axios";
import Map from '../ggleMapRender/Map';
import { BASE_URL, API_ENDPOINTS } from '../../../config';


function GetAllMaps() {

    const [maps, setMaps] = useState([{}]);
    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
    const TenantId=userdetails.email;

    useEffect(() => {
        const fetch = async() => {
            const getMaps = await axios.get(`${BASE_URL}${API_ENDPOINTS.getAllMaps}/${TenantId}`);
            setMaps(getMaps.data);
            console.log("MAPS",getMaps.data);
        };
        fetch()
    }, []);

    return(
        <Box m="20px">
            <Header title="Location Maps" />
            {maps && <div>
                {maps.map(map => (
                <>
                <div key={map._id}>{map.Name}</div>
                <div key={map._id}>{map.Address}</div>
                <div key={map._id}>{map.Lat}</div>
                <div key={map._id}>{map.Long}</div>
                </>
                ))

                }
            </div>}
                <br />
                <br />
                <h1>Manage Maps:</h1>
                <br />
                <DeleteAllMaps />
                <br />
                {/* <DeleteFarmMap /> */}
        </Box>
    )

}

export default GetAllMaps;