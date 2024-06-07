import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { BASE_URL, API_ENDPOINTS } from '../../../config';


function DeleteAllMissionPlans() {

    const navigate = useNavigate();

    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
    const TenantId=userdetails.email;


    const sendRequest = async(id) => {
        await axios.delete(`${BASE_URL}${API_ENDPOINTS.deleteAllMissionPlans}/${TenantId}`)
        .then((res) => {
            console.log(res);
        })
        .catch(err => console.log(err));
    }

    return (
        <div className="delete-all-missions-button">
            <h3>Delete all Mission Plans</h3>
            <form onSubmit={(e) => {
                sendRequest()
                .then(() => navigate("/dashboard"));
            }}>
                <button type="submit">Delete All Mission Plans</button>
            </form>
        </div>    
    )
}

export default DeleteAllMissionPlans;