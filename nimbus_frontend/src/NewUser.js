import React, {useState} from "react";
import ReactDOM from 'react-dom';
import {useParams, useNavigate} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@material-ui/core/Button';
import axios from "axios";

// grab user data from backend that just signed in 
function NewUser() {

    // token key 
    const {id_token} = useParams();

    // request student data 
    const baseURL = `${'https://idlehands.pythonanywhere.com'}/user_data`;

    React.useEffect(() => {
        axios.get(baseURL, { headers: {"Authorization": `Token  ${id_token}`} })
            .then((response) => {
            const user_data = response.data;
            //console.log(user_data)
            //console.log('testing')
        });
      }, []);
    
    // dorm locations 
    const DORM_LOCATIONS = [
        {value: 'Kissam', label: 'Kissam'},
        {value: 'EBI', label: 'EBI'},
        {value: 'Zeppos', label: 'Zeppos'},
        {value: 'Rothschild', label: 'Rothschild'},
        {value: 'Commons', label: 'Commons'},
        {value: 'Village', label: 'Village'},
        {value: 'Rand', label: 'Rand'},
        {value: 'Branscomb', label: 'Branscomb'},
        {value: 'Highland', label: 'Highland'},
    ]
    const [dorm, setDorm] = React.useState('Kissam');
    const handleDormChange = (event) => {
        setDorm(event.target.value);
  };

  // gender 
  const GENDER = [
    {value: 'Male', label: 'Male'},
    {value: 'Female', label: 'Female'},
    {value: 'Other', label: 'Other'},
    ]
    const [gender, setGender] = React.useState('Male');
    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    // phone number 
    const [number, setNumber] = React.useState('');
    const handleNumberChange = (event) => {
        setNumber(event.target.value);
    };

    // venmo
    const [venmo, setVenmo] = React.useState('');
    const handleVenmoChange = (event) => {
        setVenmo(event.target.value);
    };


    // cashapp 
    const [cashapp, setCashapp] = React.useState('');
    const handleCashappChange = (event) => {
        setCashapp(event.target.value);
    };

    // grabs data from all forms, converts to JSON, sends to backend, redirects to home 
    let navigate = useNavigate();
    async function handleSubmit(event) {
        // grabs data from all forms and converts to JSON format 
        let trip_data = {dorm: dorm, gender: gender, phone_number: number, venmo: venmo, cashapp: cashapp}
        //console.log(student_data)

        // send student_data to the backend 
        const create_student_baseURL = `${'https://idlehands.pythonanywhere.com'}/create_student`;
        axios.post(create_student_baseURL, trip_data, { headers: {"Authorization": `Token  ${id_token}`}})
            .then((response) => {
                //console.log(response)
                const response_data = response.data;
                console.log(response_data)
                navigate(`../home/${id_token}`, { replace: true });

        });
        // redirect to home 
        
    }

    return (
        <div>
            <div> </div>
            <TextField 
                id="outlined-select-dorm" 
                select
                label="Dorm" 
                variant="outlined" 
                required 
                error 
                value = {dorm} onChange={handleDormChange}
                helperText = "Select your dorm"
            >
                {DORM_LOCATIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                </MenuItem>
                ))}
            </TextField>

            <TextField 
                id="outlined-select-gender" 
                select
                label="Gender" 
                variant="outlined" 
                required 
                error 
                value = {gender} onChange={handleGenderChange}
                helperText = "Select your gender"
            >
                {GENDER.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                </MenuItem>
                ))}
            </TextField>

            <TextField id="outlined-basic" type = "number" label="Phone Number" variant="outlined" value = {number} onChange={handleNumberChange} required />

            <TextField 
                id="outlined-basic" 
                label="Venmo" 
                variant="outlined" 
                InputProps={{
                    startAdornment: <InputAdornment position="start">@</InputAdornment>,
                }} 
                value = {venmo} 
                onChange={handleVenmoChange}
                />

            <TextField 
                id="outlined-basic" 
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }} 
                label="Cashapp" 
                variant="outlined" 
                value = {cashapp} 
                onChange={handleCashappChange}/>

            <Button 
                variant="contained"
                onClick={handleSubmit}
            >
                Submit
            </Button>

        </div>
    )
}

export default NewUser 