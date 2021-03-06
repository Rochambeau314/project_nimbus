import React, {useContext, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'
import Trips from './Trips';
import MyTrips from './MyTrips';
import {useData, useDataUpdate} from './DataContext';
import {useToken} from './AuthContext';
function Home(){

    // pull the access token from the URL 
    const {id_token} = useParams();
    console.log('id_token', id_token);

    const {token, setToken} = useToken();

    React.useEffect(() => {
        setToken(id_token); 
      }, []); 

    return(
        <div>
            <div> token: {token}</div>
            <img src = {logo} alt = {"logo"} height = {200} width = {300}/>
            <h1> Hi ! Welcome to project nimbus! </h1>
            <Trips/>
            <MyTrips/>

        </div>
    )
}

export default Home