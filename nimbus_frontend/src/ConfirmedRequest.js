import React, {useContext, useState} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';
import {useData} from './DataContext';
import {useToken} from './AuthContext';


// shows up when a user's trip has Confirmed == True 
// displays the rideshare request data associated with the user's trip 
function ConfirmedRequests(){
    const confirmed_request = useData()['confirmed_request']
    //console.log(confirmed_request, 'confirmed_request')

    const confirmed_user_trip = confirmed_request['user_trip']
    console.log('confirmed_user_trip', confirmed_user_trip)

    const confirmed_partner_trip = confirmed_request['partner_trip']
    console.log('confirmed_partner_trip', confirmed_partner_trip)

    const confirmed_req_trips = confirmed_user_trip.concat(confirmed_partner_trip)
    console.log('confirmed_req_trips', confirmed_req_trips)
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

    return(
        <div>
            { (confirmed_request)
                ?
                <div style={{ height: 400, width: '100%' }}>
                    <div>Confirmed Rideshare</div> 
                    <DataGrid getRowId={row => row.trip_id}
                        rows={confirmed_req_trips} 
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick={true}/>
                </div>
                :<div></div>
            }
        </div>
    )
}

export default ConfirmedRequests 

