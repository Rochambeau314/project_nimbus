import React, {useContext, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';
import {useData} from './DataContext';

function Trips(){
    // pull the access token from the URL 
    const {id_token} = useParams();
    //console.log(id_token);

    let other_trips = useData()['other_trips']
    //console.log('other_trips', other_trips) 

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
    
return(
    <div> 
        <h1>trips </h1> 
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid getRowId={row => row.trip_id}
            rows={other_trips} 
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick={true}
        />
        </div>
    </div>

)
}

export default Trips 
