import React, {useContext, useState} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';
import {useData} from './DataContext';
import {useToken} from './AuthContext';

function RideShare() {
    const {name, id_token} = useParams();  

    const [partner, setPartner] = useState('')
    const {state} = useLocation(); 
    

    console.log('state', state)
          
    const user_trip = useData()['user_trips']
    console.log('user_trip', user_trip)

    React.useEffect(() => {
        setPartner(state); 
      }, [state]); 
    

    const columns = [ 
        {
            field: 'trip_id',
            headerName: 'trip_id', 
            type: 'number',
            width: 150,  
            editable: false, 
        },
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
    // table: 
    // rows: name of both people 
    // columns: relevant data comparisons 
    // button to send email 

    return(
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                    rows={partner} 
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick={true}/>
        </div>
    )
} 

export default RideShare 


// display comparison between current user and the potential rideshare partner 