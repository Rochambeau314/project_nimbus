import React, {useContext, useState} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';
import {useData} from './DataContext';
import {useToken} from './AuthContext';

function ConfirmRequest() {

    const {id_token} = useParams();

    const {state} = useLocation(); 
    //console.log('uselocation', state)
    const partner_trip = [state]

    const user_trip = useData()['user_trips']
    //console.log(user_trip)

    const compare_request = user_trip.concat(state)
    //console.log('compare_request', compare_request)

    const compare_data = {user_trip, partner_trip}

    // pull the rideshare request from the backend depending on user_trip and state (the trip that was clicked)
    const [specific, setSpecific] = useState();

    
    const pullRequestURL = `${'http://127.0.0.1:8000'}/rideshare_request`;
    React.useEffect(() => {
        // pull the rideshare request data from the backend 
        const useEff_data = axios.put(pullRequestURL, compare_data, { headers: {"Authorization": `Token ${id_token}`} })
        .then(function(response) {
            //console.log(response.data);
            setSpecific(response.data); 
            //console.log(user_trip[0], response.data['user_trip'][0])
            //console.log(Object.is(user_trip[0]['student'], response.data['user_trip'][0]['student']))
            if (Object.is(user_trip[0]['student'], response.data['user_trip'][0]['student'])){
                setMessage("go back")
            }
            else{
                //console.log(response.data['user_trip'])
                setMessage("Confirm Request")
        
            }
         });
      }, []); 
    
    //console.log('specific', specific)

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
    const messageURL = `${'http://127.0.0.1:8000'}/send_email/`

    const [message, setMessage] = useState("")
    const confirmRequestURL = `${'http://127.0.0.1:8000'}/confirmed_request`;
    async function handleConfirm() {

        if (Object.is(user_trip[0]['student'], specific['user_trip'][0]['student'])) {
            //console.log('user created the request; redirect to home')  
        }
        else {
            axios.post(confirmRequestURL, compare_request, { headers: {"Authorization": `Token ${id_token}`} }) // need to check if succeeded before redirecting
            //axios.put(messageURL, compare_data, { headers: {"Authorization": `Token ${id_token}`} }) // send email to the partner notifying them that they have a new rr_request 
            //console.log('request confirmed!')
        }
        navigate(`../Home/${id_token}`, { replace: false });
    };

    const deleteRequestURL = `${'http://127.0.0.1:8000'}/rideshare_request`;
    async function handleDelete() {
        const rideshare_data = {
            user_trip: user_trip,
            partner_trip: partner_trip, 
        }
        //console.log(rideshare_data)
        axios.delete(deleteRequestURL, { headers: {"Authorization": `Token ${id_token}`}, "data": {rideshare_data} }) // delete the rideshare request
        axios.delete(messageURL, { headers: {"Authorization": `Token ${id_token}`}, 'data': rideshare_data }) // send email to the partner notifying

        //console.log('submitted a delete request')

        // redirect to home 
        navigate(`../Home/${id_token}`, { replace: false });
    };
    
    return(
        <div>
            <h1> confirm request </h1>
            { (compare_request)
                ? <div style={{ height: 400, width: '100%' }}>
                    <DataGrid getRowId={row => row.trip_id}
                        rows={compare_request} 
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick={true}/>
                </div>
                :<div></div>
            }
            <Button variant="contained" onClick={handleConfirm}> {message} </Button>
            <Button variant="contained" onClick={handleDelete}> delete </Button>
        </div>)
} 

export default ConfirmRequest 


// display comparison between current user and the potential rideshare partner 