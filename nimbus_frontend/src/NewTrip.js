import React, {useState} from "react";
import ReactDOM from 'react-dom';
import {useParams, useNavigate} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from "axios";
import DateAdapter from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import dayjs from "dayjs";
import NimbusHeader from './NimbusHeader'
function formatDT(dt){
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
      ]

    const weekdays = ['Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday', ]


    const dayjs_obj = dayjs(dt)
        // console.log('dayjs_obj', dayjs_obj)
        let trip_hour = dayjs_obj.hour()
        let trip_ap = ''        
        if (trip_hour >= 11){
            trip_hour = trip_hour - 12
            trip_ap = 'PM'
        }
        else{
            trip_ap = 'AM'
        }
        if (trip_hour ==0){
            trip_hour = 12
        }
        let trip_minute = dayjs_obj.minute()
        if (trip_minute <10){
            trip_minute = '0' + trip_minute.toString()
        }
        else{
            trip_minute = trip_minute.toString()
        }
        
        const datetime_data = {
            datetime: dayjs_obj,
            weekday: weekdays[dayjs_obj.get('day')], 
            month: months[dayjs_obj.get('month')],
            day: dayjs_obj.date().toString(),
            hour: trip_hour.toString(),
            minute: trip_minute.toString(),
            ap: trip_ap
        }
    return datetime_data
}

function NewTrip() {
    const {id_token} = useParams();
    // name from user
    const [user, setUser] = React.useState('');

    // dorm from student
    const [dorm, setDorm] = React.useState('');

    // var for arrival time 
    const [datetime, setDatetime] = React.useState(dayjs());
    const [dt_dict, setDT] = React.useState(formatDT(datetime));
    const handleDatetimeChange = (newDate) => {
        setDT(formatDT(newDate))
        
        //setDT(weekdays[dayjs_obj.get('day')]+', ' + months[dayjs_obj.get('month')] + ' ' + dayjs_obj.date().toString())
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
        });
      }, []);

      let navigate = useNavigate();
      async function handleSubmit(event) {
          let trip_data = {student: user, 
                            dorm: dorm, 
                            number_of_bags: luggage, 
                            trip_datetime : dt_dict['datetime'], 
                            weekday: dt_dict['weekday'], 
                            month: dt_dict['month'], 
                            day: dt_dict['day'], 
                            hour: dt_dict['hour'], 
                            minute: dt_dict['minute'], 
                            ap: dt_dict['ap']}
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
            <NimbusHeader/>
            <h3>Create a Trip</h3>
            <LocalizationProvider dateAdapter={DateAdapter}>
                <DateTimePicker
                    label="Pickup Time"
                    value={datetime}
                    onChange={handleDatetimeChange}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <div> </div>                
            <TextField 
                id="outlined-number" 
                label="Luggage" 
                variant="outlined" 
                type = "number" 
                value = {luggage} 
                onChange={handleLuggageChange} 
                required 
            />
            <div></div> 
            <Button variant="contained" onClick={handleSubmit}> Submit </Button>
            <div> {message} </div> 
        </div>
    )
}

export default NewTrip 
