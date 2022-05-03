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
    const {name, id_token} = useParams();  


    const confirmed_request = useData()['confirmed_request']
    //console.log(confirmed_request, 'confirmed_request')

    const confirmed_user_trip = confirmed_request['user_trip']
    //console.log('confirmed_user_trip', confirmed_user_trip)

    const confirmed_partner_trip = confirmed_request['partner_trip']
    //console.log('confirmed_partner_trip', confirmed_partner_trip)

    let confirmed_req_trips = {}
    if (typeof confirmed_partner_trip === 'undefined'){
        //console.log('confirmed_request === undefined')
    }
    else {
        //console.log('confirmed_request != undefined')
        confirmed_req_trips = confirmed_user_trip.concat(confirmed_partner_trip)
        //console.log('confirmed_req_trips', confirmed_req_trips)
    }

    // grab data of both parties after confirmed 
    const studentDataURL = `${'https://idlehands.pythonanywhere.com'}/student_data`;
    const [user, setUser] = useState();
    const [partner, setPartner] = useState();
    React.useEffect(() => {
        axios.post(studentDataURL, confirmed_user_trip[0]['student'], { headers: {"Authorization": `Token  ${id_token}`} })
            .then((response) => {
            const user_data = response.data;
            //console.log(user_data)
            //console.log('testing')
            setUser(user_data)

        });

        axios.post(studentDataURL, confirmed_partner_trip[0]['student'], { headers: {"Authorization": `Token  ${id_token}`} })
            .then((response) => {
            const partner_data = response.data;
            //console.log(partner_data)
            //console.log('testing')
            setPartner(partner_data)
    
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

    ]

    let navigate = useNavigate();
    const deleteRequestURL = `${'https://idlehands.pythonanywhere.com'}/confirmed_request`;
    async function handleDelete() {
        const rideshare_data = {
            user_trip: confirmed_user_trip,
            partner_trip: confirmed_partner_trip, 
        }
        //console.log(rideshare_data)
        axios.delete(deleteRequestURL, { headers: {"Authorization": `Token ${id_token}`}, "data": {rideshare_data} }) // need to check if succeeded before redirecting
        //console.log('submitted a delete request')

        navigate(`../Home/${id_token}`, { replace: true })
    };
    //console.log(user)
    //console.log(partner)
    return(
        <div>
            { (confirmed_req_trips && user && partner)
                ? <div style={{ height: 250, width: '100%' }}>
                    <DataGrid getRowId={row => row.trip_id}
                        rows={confirmed_req_trips} 
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick={true}
                    />
                    <h2>Phone Numbers: {user['phone_number']},  {partner['phone_number']}</h2>
                    <h2>Venmo: {user['venmo']}, {partner['venmo']}</h2>
                    <h2>Cashapp: {user['cashapp']}, {partner['cashapp']}</h2>


                    <Button variant="contained" onClick={handleDelete}> delete (refresh after deleting)</Button>

                </div>
                :<div></div>
            }
        </div>
    )
}

export default ConfirmedRequests 

