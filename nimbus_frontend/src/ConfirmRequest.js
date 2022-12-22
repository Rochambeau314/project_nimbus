import React, {useContext, useState} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import axios from "axios";
import Button from '@material-ui/core/Button';
import { DataGrid } from '@mui/x-data-grid';
import {useData} from './DataContext';
import {useToken} from './AuthContext';
import NimbusHeader from "./NimbusHeader";
import Trip from './Trip';
import Stack from '@mui/material/Stack';

function ConfirmRequest() {

    const {id_token} = useParams();

    const {state} = useLocation(); 
    console.log('uselocation', state)
    const partner_trip = [state]

    const user_trip = useData()['user_trips']
    console.log(user_trip)

    const compare_request = user_trip.concat(state)
    console.log('compare_request', compare_request)

    const [confirm_components, setComp] = useState('confirm_components')
    React.useEffect(() => {
        if (compare_request !== undefined){
            if (Object.keys(compare_request).length !== 0){
                console.log('other_trips in useEffect', compare_request)
                const conf_comp = compare_request.map((trip) => <Trip key = {trip.trip_id} data={trip} ></Trip>)
                setComp(conf_comp)
            }   
        }   
    }, [user_trip]); // not working i dont think 



    // pull the rideshare request from the backend depending on user_trip and state (the trip that was clicked)
    const [specific, setSpecific] = useState();
    const compare_data = {user_trip, partner_trip}
    console.log('compare_data', compare_data)

    const pullRequestURL = `${'http://127.0.0.1:8000'}/rideshare_request`;
    React.useEffect(() => {
        // pull the rideshare request data from the backend 
        const useEff_data = axios.put(pullRequestURL, compare_data, { headers: {"Authorization": `Token ${id_token}`} })
        .then(function(response) {
            console.log(response.data);
            setSpecific(response.data); 
            console.log(user_trip[0], response.data['user_trip'][0])
            console.log(Object.is(user_trip[0]['student'], response.data['user_trip'][0]['student']))
            if (Object.is(user_trip[0]['student'], response.data['user_trip'][0]['student'])){
                setMessage("go back")
            }
            else{
                console.log(response.data['user_trip'])
                setMessage("Confirm Request")
        
            }
         });
      }, []); 
    
    console.log('specific', specific)

    // send rideshare request data to backend, redirect to scheduled rideshares 
    let navigate = useNavigate();
    const messageURL = `${'http://127.0.0.1:8000'}/send_email/`

    const [message, setMessage] = useState("")
    const confirmRequestURL = `${'http://127.0.0.1:8000'}/confirmed_request`;
    async function handleConfirm() {
        if(Object.is(user_trip[0]['student'], specific['user_trip'][0]['student'])) 
        {
            console.log('user created the request; redirect to home')
        }

        else
        {
            axios.post(confirmRequestURL, compare_request, { headers: {"Authorization": `Token ${id_token}`} }) // need to check if succeeded before redirecting
            axios.put(messageURL, [specific['user_user'], specific['partner_user']], { headers: {"Authorization": `Token ${id_token}`} }) // send email to the partner notifying them that they have a new rr_request 
            console.log('request confirmed!')
        }
        navigate(`../Home/${id_token}`, { replace: false });
    };

    const deleteRequestURL = `${'http://127.0.0.1:8000'}/rideshare_request`;
    async function handleDelete() {
        const rideshare_data = {
            user_trip: user_trip,
            partner_trip: partner_trip, 
        }
        console.log(rideshare_data)
        axios.delete(deleteRequestURL, { headers: {"Authorization": `Token ${id_token}`}, "data": {rideshare_data} }) // need to check if succeeded before redirecting
        axios.delete(messageURL, { headers: {"Authorization": `Token ${id_token}`}, 'data': rideshare_data }) // send email to the partner notifying them that they have a new rr_request 

        console.log('submitted a delete request')

        // redirect to home 
        navigate(`../Home/${id_token}`, { replace: false });
    };

    
    return(
        <div>
            <NimbusHeader></NimbusHeader>
            <h2> Confirm Request? </h2>
            { (compare_request !== undefined && Object.keys(compare_request).length !== 0)
                ? <Stack justifyContent="left" alignItems="left" spacing = {1.25} > 
                    {confirm_components}
                </Stack>
                : <div> 0 </div>
            }
            <Button variant="contained" onClick={handleConfirm}> {message} </Button>
            <Button variant="contained" onClick={handleDelete}> delete </Button>
        </div>)
} 

export default ConfirmRequest 


// display comparison between current user and the potential rideshare partner 