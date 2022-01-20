import React, {useState} from "react";
import ReactDOM from 'react-dom';
import {useParams, useNavigate} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@material-ui/core/Button';
import axios from "axios";
import DateAdapter from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import dayjs from "dayjs";

function NewTrip() {

    const {id_token} = useParams();
    // name from user
    const [user, setUser] = React.useState('');

    // dorm from student
    const [dorm, setDorm] = React.useState('');

    // gender from student
    const [gender, setGender] = React.useState('');
    
    // phone number from student
    const [number, setNumber] = React.useState('');
    
    // venmo from student
    const [venmo, setVenmo] = React.useState('');
    
    // cashapp from student 
    const [cashapp, setCashapp] = React.useState('');

    // var for arrival time 
    const [datetime, setDatetime] = React.useState(dayjs());
    const handleDatetimeChange = (newDate) => {
        setDatetime(newDate);
    }
    // number of bags 
    const [luggage, setLuggage] = React.useState('');
    const handleLuggageChange = (event) => {
        setLuggage(event.target.value);
    }

    const [error, setError] = React.useState(false);
    const handleErrorChange = (event) => {
        setError(true);
    }
    const error_message = "only 1 trip at a time. sorry!"

    // request user/student data 
    const userDataURL = `${'http://127.0.0.1:8000'}/user_data`;
    const studentDataURL = `${'http://127.0.0.1:8000'}/student_data`;

    React.useEffect(() => {
        axios.get(userDataURL, { headers: {"Authorization": `Token  ${id_token}`} })
            .then((response) => {
            const user_data = response.data;
            console.log(user_data)
            console.log('testing')
            setUser(user_data.name)

        });

        axios.get(studentDataURL, { headers: {"Authorization": `Token  ${id_token}`} })
            .then((response) => {
            const student_data = response.data;
            console.log(student_data)
            setDorm(student_data.dorm)
            setGender(student_data.gender)
            setNumber(student_data.phone_number)
            setVenmo(student_data.venmo)
            setCashapp(student_data.cashapp)
        });
      }, []);

      let navigate = useNavigate();
      async function handleSubmit(event) {
          // grabs data from all forms and converts to JSON format 
          let trip_data = {student: user, dorm: dorm, pickup_time: datetime, number_of_bags: luggage}
          console.log(trip_data)
  
          // send student_data to the backend 
          const create_trip_baseURL = `${'http://127.0.0.1:8000'}/create_trip`;
          axios.post(create_trip_baseURL, trip_data, { headers: {"Authorization": `Token  ${id_token}`}})
            .then((response) => {
                console.log(response)
                const response_data = response.data;
                console.log(response_data)
                console.log(response.status)
                navigate(`../home/${id_token}`, { replace: true });
            })
            .catch(function (error) {
                // status code outside of 2xx
                if (error.response) {
                    console.log(error.response.status);
                    handleErrorChange()
                    //navigate(`../home/${id_token}`, { replace: true });
                
                // The request was made but no response was received
                } else if (error.request) {
                    console.log(error.request);
                    navigate(`../error/${id_token}`, { replace: true });
                
                // Something happened in setting up the request that triggered an Error
                } else {
                    console.log('Error', error.message);
                    navigate(`../error/${id_token}`, { replace: true });

                }
            })

          
          // redirect to home 
      }
    
    let message = ""
    if (error){
        message = "only 1 trip at a time. Sorry!"
    }
    return (
        <div>
            <div>{user}'s New Trip</div> 
            <div> Dorm: {dorm} </div>
            <div>Gender: {gender}</div>
            <div>Number: {number} </div>
            <div>Venmo: {venmo} </div>
            <div>Cashapp: {cashapp}</div>
            <LocalizationProvider dateAdapter={DateAdapter}>
            <DateTimePicker
                label="Arrival Time"
                value={datetime}
                onChange={handleDatetimeChange}
                renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>    
            <TextField id="outlined-number" label="Luggage" variant="outlined" type = "number" value = {luggage} onChange={handleLuggageChange} required />
            
            <Button variant="contained" onClick={handleSubmit}> Submit </Button>
            <div> {message} </div> 
        </div>
    )
}

export default NewTrip 