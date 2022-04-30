import React, {useContext, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';
import {useData} from './DataContext';

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

    const columns = [
        {
            field: 'student',
            headerName: 'name',
            width: 150,
            editable: false,
        },
        {
            field: 'dorm',
            headerName: 'dorm',
            width: 150,
            editable: false,
        },
        {
            field: 'pickup_time',
            headerName: 'time',
            type: 'dateTime',
            width: 200,
            valueGetter: ({ value }) => value && new Date(value),
            editable: false,
        },
        {
            field: 'number_of_bags',
            headerName: 'luggage',
            type: 'number',
            width: 110,
            editable: false,
        },

    ];
    //console.log(trips)

    // redirect to New Trip page onSubmit of the New Trip button 
    let navigate = useNavigate();
    async function handleSubmit(event) {
        // redirect to new trip 
        navigate(`../NewTrip/${id_token}`, { replace: false });
    };
return(
    <div> 
        <h1>My Trip </h1> 
        { (my_trip.length > 0)
            ? <div style={{ height: 175, width: '50%', margin: 'auto' }}>
                    <DataGrid getRowId={row => row.trip_id}
                        rows={my_trip}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick={true}
                        onRowClick = {handleSubmit}/>
                </div>
            : <Button variant="contained" onClick={handleSubmit}> {"Create a Trip"} </Button> 
        }
    </div>

)
}

export default MyTrips 
