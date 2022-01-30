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
    const {name, id_token} = useParams();  

    const [partner, setPartner] = useState('')
    const {state} = useLocation(); 
    console.log('state', [state])
          
    const user_trip = useData()['user_trips']
    console.log('user_trip', user_trip)

    const row_data = [state, user_trip[0]]
    console.log(row_data)

    React.useEffect(() => {
        setPartner(state); 
      }); 
    

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
        async function handleClick(event) {
            //console.log('request confirmed!')
            axios.get(rideshareRequestURL, { headers: {"Authorization": `Token ${id_token}`} }) 
            //navigate(`../Home/${id_token}`, { replace: false });
        };

    return(
        <div>
            <div> pending requests </div>
            <div style={{ height: 400, width: '100%' }}>
            <DataGrid getRowId={row => row.trip_id}
                    rows={""} 
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick={true}/>
            </div>
            <div>{id_token}</div>
            <Button variant="contained" onClick={handleClick}> Confirm Request </Button>
        </div>)
} 

export default PendingRequests 


// display comparison between current user and the potential rideshare partner 