import React, {useContext, useState} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';
import {useData} from './DataContext';
import {useToken} from './AuthContext';

function PendingRequests() {
    const {id_token} = useParams();

    const pending_req = useData()['pending_requests']
    console.log('pending_requests', pending_req)

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
    ]

        // send rideshare request data to backend, redirect to scheduled rideshares 
        let navigate = useNavigate();
        const rideshareRequestURL = `${'http://127.0.0.1:8000'}/rideshare_request`;
        async function handleClick(data) {
            console.log('PendingRequests --> ConfirmRequest',data)
            console.log('redirected to comparison page! ')
            navigate(`../ConfirmRequest/${data['student']}/${id_token}`, {state: data});
        };

    return(
        <div>
            <h1> My Pending Requests </h1>
            { (pending_req)
                ? <div style={{ height: 400, width: '100%' }}>
                    <DataGrid getRowId={row => row.trip_id}
                        rows={pending_req} 
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick={true}
                        onRowClick={(data) => handleClick(data['row'])}/>
                </div>
                :<div></div>
            }
        </div>)
} 

export default PendingRequests 


// display comparison between current user and the potential rideshare partner 