import React, {useState, useEffect} from "react";
import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from '../../../config';


function DeleteFarmMap() {
    
    const [farmData, setFarmData] = useState([{}]);
    const [selected, setSelected] = useState([{}]);
    

    useEffect(() => {
        fetch(`${BASE_URL}${API_ENDPOINTS.getAllMaps}`)
        .then(res => res.json())
        .then(data => {setFarmData(data)});
    }, []);


    const sendRequest = async() => {
        await axios.delete(`${BASE_URL}${API_ENDPOINTS.deleteMapByName}`, {Name: selected.Name })
        .then((res) => {
            console.log(res);
        })
        .catch(err=>console.log(err));
    }

    
    return(
        <div className="farm-drop-down">
            <h3>Select a map to delete:</h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                console.log(selected);
                sendRequest().then(()=>alert("Successfully deleted meap from db!"));
            }}>
                <select name="Location" value={farmData.Location} onChange={(e) => { 
                    console.log(e.target.value);
                    setSelected(e.target.value);
                }}>
                    <option disabled={true} value="">Select a farm</option>
                        {farmData.map((farmData) => {
                            return (
                                <option key={farmData.id} value ={farmData.id}>{farmData.Name}</option>
                            )
                        })}
                </select>
                <button type="submit">Submit</button>
            </form>
        </div>
    )

}

export default DeleteFarmMap;