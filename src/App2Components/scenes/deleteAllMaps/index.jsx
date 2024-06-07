import React from "react";
import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from '../../../config';


function DeleteAllMaps() {

    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
    const TenantId=userdetails.email;

    return (
        <div className="delete-all-maps-button">
            <h3>Delete all Maps</h3>
            <form onSubmit={(e) => {
                axios.delete(`${BASE_URL}${API_ENDPOINTS.deleteAllMaps}/${TenantId}`);
            }}>
                <button type="submit">Delete All Maps</button>
            </form>
        </div>    
    )
}

export default DeleteAllMaps;