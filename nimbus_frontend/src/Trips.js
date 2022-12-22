import React, {useContext, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
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

function Trips(){    
    const {token} = useToken() 
    const context_data = useData(); 
    const [data, setData] = useState([]) 


    // redirects to specific trip when a trip is clicked 
    let navigate = useNavigate();
    async function handleTripClick(event, data){ 
        console.log('clicked!', data)
        navigate(`../RideShare/${data['student']}/${token}`, {state: data});
    } 

    React.useEffect(() => {
        console.log('trips useEffect has updated the data')
        setData(context_data);  
    }); 
      
    const other_trips = data['other_trips'] 

    const [othertrips_components, setComp] = useState('othertrips_components')
    React.useEffect(() => {
        if (other_trips !== undefined){
            if (Object.keys(other_trips).length !== 0){
                console.log('other_trips in useEffect', other_trips)
                //const otrips_comp = other_trips.map((other_trip) => other_trip)
                const otrips_comp = other_trips.map((other_trip) => <Trip key = {other_trip.trip_id} data={other_trip} handleTripClick = {event => handleTripClick(event, other_trip)}></Trip>)
                setComp(otrips_comp)
            }   
        }   
    }, [other_trips]); 
    

    console.log(othertrips_components)

    // white divider: sx={{ bgcolor: "white" }}
    return(
        <div> 
            <h2 style= {{'textAlign': 'left'}} >All Trips </h2> 
            { (other_trips !== undefined && Object.keys(other_trips).length !== 0)
                ? <Stack justifyContent="left" alignItems="left" spacing = {1.25} divider= {<Divider orientation="horizontal" flexItem sx={{ bgcolor: "white" }}/>} > 
                    {othertrips_components}
                </Stack>
                : <div> No one else yet... sit tight!  </div>
            }

        </div>
    )
}

export default Trips 
