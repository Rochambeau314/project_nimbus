import React, {useContext, useState} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import {useData} from './DataContext';
import {useToken} from './AuthContext';
import Trip from './Trip';
import Stack from '@mui/material/Stack';

function PendingRequests() {
    const {id_token} = useParams();
    //console.log(id_token)
    
    // data
    const pending_req = useData()['pending_requests']
    console.log('pending_requests', pending_req)


    // redirects to specific trip when a trip is clicked 
    let navigate = useNavigate();
    async function handleTripClick(event, data){ 
        console.log('clicked!', data)
        navigate(`../ConfirmRequest/${data['student']}/${id_token}`, {state: data});
    } 

    const [othertrips_components, setComp] = useState('othertrips_components')
    React.useEffect(() => {
        if (pending_req !== undefined){
            if (Object.keys(pending_req).length !== 0){
                console.log('other_trips in useEffect', pending_req)
                //const otrips_comp = other_trips.map((other_trip) => other_trip)
                const otrips_comp = pending_req.map((pending_trip) => <Trip key = {pending_trip.trip_id} data={pending_trip} handleTripClick = {event => handleTripClick(event, pending_trip)}></Trip>)
                setComp(otrips_comp)
            }   
        }   
    }, [pending_req]); 

    return(
        <div>
            <h2 style= {{'textAlign': 'left'}}> Pending Matches </h2> 
            { (pending_req !== undefined && Object.keys(pending_req).length !== 0)
                ? <Stack justifyContent="left" alignItems="left" spacing = {1.25} > 
                    {othertrips_components}
                </Stack>
                : <div> None yet... tap on a trip to submit a request, or sit tight! </div>
            }
        </div>)
} 

export default PendingRequests 

