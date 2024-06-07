import React, {useState, useEffect} from "react";
import {Box} from "@mui/material";
import Header from "../../components/Header";
import DeleteAllMissionPlans from "../deleteAllMissions";
import DeleteMissionById from "../deleteMissionById";
import TenantIdSingleton from "../../components/TenantId";
import { BASE_URL, API_ENDPOINTS } from '../../../config';

function GetAllMissions() {
    
    const [missions, setMissions] = useState([{}]);
    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
    const TenantId=userdetails.email;


    useEffect(() => {
        fetch(`${BASE_URL}${API_ENDPOINTS.getAllMissionPlans}/${TenantId}`)
        .then(res => res.json())
        .then(data => {setMissions(data)});
    }, []);


    const displayMissionPlans = missions.map((info) => {
        return (
            <tr>
                <td>{info.MissionId}</td>
                <td>{info.MissionType}</td>
                <td>{info.Location}</td>
                <td>{info.FlightHeight}</td>
                <td>{info.Alerts}</td>
            </tr>
        )
    })

    
    return (
        <Box m="20px">
            <Header title="All Mission Plans" />
                <table className="mission-plans" border="1" cellpadding="3" cellspacing="2">
                    <thead>
                        <tr>
                            <th>Mission Id</th>
                            <th>Mission Type</th>
                            <th>Location</th>
                            <th>Flight Height</th>
                            <th>Alerts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayMissionPlans}
                    </tbody>
                </table>
            <br />
            <br />
            <h1>Manage Mission Plans:</h1>
            <br />
            <DeleteAllMissionPlans />
            <br />
            <br />
            <DeleteMissionById />
        </Box>            
    )
}

export default GetAllMissions;