import React, {useContext, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';
import {useData} from './DataContext';  
import {useToken} from './AuthContext';

function Trips(){ 
    const {token} = useToken()
    const context_data = useData(); 
    const [data, setData] = useState([])
    React.useEffect(() => {
        setData(context_data); 
      }, [data]); 
      
    console.log('data in trips', data)
    const other_trips = data['other_trips']
    console.log('other_trips', data['other_trips']) 

    const user_trip = data['user_trips']  

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

    // redirects to specific washer when a washer is clicked 
    let navigate = useNavigate();
    async function handleTripClick(data){ 
        console.log('clicked!', data['student'])
        navigate(`../RideShare/${data['student']}/${token}`, {state: data});
    } 
return(
    <div> 
        <h1>trips </h1> 
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid getRowId={row => row.trip_id}
            rows={other_trips} 
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick={true}
            onRowClick={(data) => handleTripClick(data['row'])}
        />
        </div>
    </div>

)
}

export default Trips 
