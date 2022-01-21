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
    console.log(id_token);

    let trips = useData()

    // //variable for trip data 
    // const [trips, setTrips] = useState([])
    // const [student, setStudent] = useState([])    

    // // pull all current trips from backend 
    // const tripURL = `${'http://127.0.0.1:8000'}/create_trip`;

    // // pull current student data
    // const studentURL = `${'http://127.0.0.1:8000'}/student_data`;

    // React.useEffect(() => {
    //     axios.get(studentURL, { headers: {"Authorization": `Token ${id_token}`} })
    //         .then((response) => {
    //         const student_data = response.data;
    //         console.log('student_data', student_data)
    //         setStudent(student_data)
    //     });

    //     axios.get(tripURL, { headers: {"Authorization": `Token ${id_token}`} })
    //         .then((response) => {
    //         const trip_data = response.data;
    //         setTrips(trip_data)
    //         //console.log('trip_data', trip_data)
    //     });
    //   }, []);
    

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
            rows={trips}
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
