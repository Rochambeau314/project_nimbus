import React, {useContext, useState} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';
import {useData} from './DataContext';  
import {useToken} from './AuthContext';
import Stack from '@mui/material/Stack';


function Trip(props){         
    const {token} = useToken() 
    const context_data = useData(); 
    console.log(props) 
    const trip_data = props.data 
    //const my_trip = useData()['user_trips']
    console.log('trip_data', trip_data)

    return(
        <div>
        { (trip_data !== undefined)  
            ? <div onClick = {props.handleTripClick}> 
                <div style= {{'textAlign': 'left', 'fontWeight': 'bold'}} >{trip_data['student']}</div>
                <div style= {{'textAlign': 'left'}}> {trip_data['hour']}:{trip_data['minute']} {trip_data['ap']} | {trip_data['dorm']} | {trip_data['number_of_bags']} luggage</div>
            </div>
            : <div></div>
        }
        </div>
    )
}

export default Trip