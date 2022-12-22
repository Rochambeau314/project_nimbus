import React, {useContext, useState} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';
import {useData} from './DataContext';
import {useToken} from './AuthContext';
import NimbusHeader from "./NimbusHeader";
import Trip from './Trip';
import Stack from '@mui/material/Stack';

// shows up when a user's trip has Confirmed == True 
// displays the rideshare request data associated with the user's trip 
function ConfirmedRequests(){
    const {name, id_token} = useParams();  

    // grab trip data from confirmed rideshare request
    const [trips, setTrips] = useState()
    const [confirmed_component, setComp] = useState('');
    const confirmedURL = `${'http://127.0.0.1:8000'}/confirmed_request`;
    React.useEffect(() => {
        axios.get(confirmedURL, { headers: {"Authorization": `Token  ${id_token}`} })
            .then((response) => {

            const utrip = response.data['user_trip']
            const ptrip = response.data['partner_trip']
            
            const trips_combined = utrip.concat(ptrip)
            setTrips(trips_combined)

            const confirmed_comp = trips_combined.map((trip) => <Trip key = {trip.trip_id} data={trip} ></Trip>)
            setComp(confirmed_comp)
            // console.log(compare_request)
            // setCTrips(trips_combined)
        });
    }, []);


    let navigate = useNavigate();
    const deleteRequestURL = `${'http://127.0.0.1:8000'}/confirmed_request`;
    async function handleDelete() {
        axios.delete(deleteRequestURL, { headers: {"Authorization": `Token ${id_token}`}, "data": trips }) // need to check if succeeded before redirecting
        console.log('submitted a delete request')

        navigate(`../Home/${id_token}`, { replace: true })
    };


    return(
        <div>
            <h2> Rideshare Confirmation </h2>
                { (confirmed_component !== '')
                    ? <div>
                        <Stack justifyContent="left" alignItems="left" spacing = {1.25} > {confirmed_component} </Stack>
                        <Button variant="contained" onClick={handleDelete}> delete </Button>
                    </div>
                    : <div>  </div>
                }
        </div>
    )
}

export default ConfirmedRequests 

