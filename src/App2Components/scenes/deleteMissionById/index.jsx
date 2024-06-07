import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { BASE_URL, API_ENDPOINTS } from '../../../config';

function DeleteMissionById() {

    const navigate = useNavigate();
    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
    const TenantId=userdetails.email;

    const [missionPlan, setMissionPlan] = useState({
        MissionId: "",
        TenantId: TenantId
    });

    const handleChange = (e) => {
        setMissionPlan((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const sendRequest = async(id) => {
        await axios.delete(`${BASE_URL}${API_ENDPOINTS.deleteMissionPlanById}/${missionPlan.MissionId}/${missionPlan.TenantId}`)
        .then((res) => {
            console.log(res);
        })
        .catch(err => console.log(err));
    }
    
    return (
        <div>
            <h3>Delete mission plan:</h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                console.log(missionPlan);
                sendRequest()
                .then(() => navigate("/dashboard"));
            }}>
                <input type="text" name="MissionId" value={missionPlan.MissionId} onChange={handleChange} />
                <button type="submit">Delete mission plan</button>
            </form>
        </div>
    )
}

export default DeleteMissionById;