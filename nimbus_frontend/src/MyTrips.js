import React, {useContext, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';

function Trips(){
    // pull the access token from the URL 
    const {id_token} = useParams();
    console.log(id_token);

    //variable for trip data 
    const [trips, setTrips] = useState([])

    // variable for button text (default vs error)
    const [message, setMessage] = useState('New Trip')

    // pull all current trips from backend 
    const tripURL = `${'http://127.0.0.1:8000'}/my_trips`;

    React.useEffect(() => {
        axios.get(tripURL, { headers: {"Authorization": `Token ${id_token}`} })
            .then((response) => {
            const trip_data = response.data;
            setTrips(trip_data)
            console.log('my trips', trip_data)
        });
      }, []);
    

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
    console.log(trips)

    // redirect to New Trip page onSubmit of the New Trip button 
    let navigate = useNavigate();
    async function handleSubmit(event) {
        if (trips.length == 0){
            navigate(`../NewTrip/${id_token}`, { replace: false });
        } else {
            setMessage('only 1 trip at a time. sorry!')
        }
    };
return(
    <div> 
        <h1>My Trips </h1> 
        <Button variant="contained" onClick={handleSubmit}> {message} </Button>
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid getRowId={row => row.trip_id}
            rows={trips}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick={true}/>
        </div>
    </div>

)
}

export default Trips 
