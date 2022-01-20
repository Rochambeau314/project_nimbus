import React, {useContext, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'
import Trips from './Trips';
import MyTrips from './MyTrips';

function Home(){

    const [name, setName] = useState()    

    // pull the access token from the URL 
    const {id_token} = useParams();
    console.log(id_token);


    // pull name and email from backend 
    const studentURL = `${'http://127.0.0.1:8000'}/student_data`;

    // pull user data from backend 
    const userURL = `${'http://127.0.0.1:8000'}/user_data`;

     React.useEffect(() => {
        axios.get(studentURL, { headers: {"Authorization": `Token ${id_token}`} })
            .then((response) => {
            const student_data = response.data;
            console.log('student_data', student_data)
        });

        axios.get(userURL, { headers: {"Authorization": `Token ${id_token}`} })
            .then((response) => {
            const user_data = response.data;
            setName(user_data['name'])
            console.log('user_data', user_data)
        });
      }, []);

    // display all matched trips 
    // create a trip button linking to create trip page 
    return(
        <div>

            <div> {id_token}</div>
            <img src = {logo} alt = {"logo"} height = {200} width = {300}/>
            <h1> Hi {name}! Welcome to project nimbus! </h1>
            <Trips/>
            <MyTrips/>

        </div>
    )
}

export default Home