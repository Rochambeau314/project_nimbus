import React, {useContext, useState} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';
import {useData} from './DataContext';
import {useToken} from './AuthContext';
import Trip from './Trip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import NimbusHeader from "./NimbusHeader";

// display comparison between current user and the potential rideshare partner 
function RideShare() {

    //data
    const {name, id_token} = useParams();  

    const {state} = useLocation(); 
    // console.log('state', [state])
          
    const user_trip = useData()['user_trips']
    
    const row_data = [state, user_trip[0]]
    console.log(row_data)

    // combine data for stack 
    const [stack_comp, setComp] = useState('stack_comp')
    React.useEffect(() => {
        if (row_data !== undefined){
            if (Object.keys(row_data).length !== 0){
                console.log('other_trips in useEffect', row_data)
                //const otrips_comp = other_trips.map((other_trip) => other_trip)
                const match_comp = row_data.map((row_dat) => <Trip key = {row_dat.trip_id} data={row_dat}></Trip>) 
                setComp(match_comp)
            }   
        }   
    }, [user_trip, state]); 


    // send rideshare request data to backend, redirect to scheduled rideshares 
    let navigate = useNavigate();
    const rideshareRequestURL = `${'http://127.0.0.1:8000'}/rideshare_request`;
    const messageURL = `${'http://127.0.0.1:8000'}/send_email/`
    async function handleClick(event) {
        const rideshare_data = {
            user_trip: user_trip,
            partner_trip: state, 
        }
        //console.log(rideshare_data)
        axios.post(rideshareRequestURL, rideshare_data, { headers: {"Authorization": `Token ${id_token}`} }) // need to check if succeeded before redirecting
        .then((response) => {
            if (response.status === 302){
                navigate(`../Error/${id_token}`, { replace: false });
            }
            navigate(`../Home/${id_token}`, { replace: false });
            axios.post(messageURL, rideshare_data, { headers: {"Authorization": `Token ${id_token}`} }) // need to check if succeeded before redirecting
        })
        
    };

    return(
        <div>
            <NimbusHeader/>
            <h2 style= {{'textAlign': 'left'}} > Request To Carpool </h2> 
            { (row_data !== undefined && Object.keys(row_data).length !== 0)
                ? <Stack justifyContent="left" alignItems="left" spacing = {1.25} > 
                    {stack_comp}
                </Stack>
                : <div> 0 </div>
            }

            <Button variant="contained" onClick={handleClick}> Send Request </Button>
        </div>)
} 

export default RideShare 

