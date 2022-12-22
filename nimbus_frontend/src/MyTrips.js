import React, {useContext, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';
import {useData} from './DataContext';
import dayjs from "dayjs";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function MyTrips(){
    // pull the access token from the URL 
    const {id_token} = useParams();
    //console.log(id_token);

    //variable for trip data 
    const my_trip = useData()['user_trips']

    // variable for button text (new trip vs edit trip 
    let message = "" 
    if (my_trip.length == 0){
        message = "New Trip"

    }else{
        message = "Edit Trip"
    }

    //console.log(trips)

    // redirect to New Trip page onSubmit of the New Trip button 
    let navigate = useNavigate();
    async function handleSubmit(event) {
        // redirect to new trip 
        navigate(`../NewTrip/${id_token}`, { replace: false }); 
    };

    // <h2 style= {{'textAlign': 'left'}}>My Trip </h2> 

    return(
        <div> 
            { (my_trip.length > 0)
                ? <div>
                    <div onClick = {handleSubmit} style= {{'display':'inline-block', 'verticalAlign':'left'}}> 
                        {my_trip[0]['weekday']}, {my_trip[0]['month']} {my_trip[0]['day']} | {my_trip[0]['hour']}:{my_trip[0]['minute']} {my_trip[0]['ap']} | {my_trip[0]['dorm']}
                    </div>
                    <div style= {{'display':'inline-block', 'verticalAlign':'left'}}> 
                        <ArrowDropDownIcon/> 
                    </div>
                </div>
                : <Button variant="contained" onClick={handleSubmit}> {"Create a Trip"} </Button>  
            }
        </div>

)
}

export default MyTrips 
