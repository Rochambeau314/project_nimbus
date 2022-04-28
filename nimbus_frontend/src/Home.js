import React, {useContext, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'
import Trips from './Trips';
import MyTrips from './MyTrips';
import PendingRequests from './PendingRequests'
import {useData, useDataUpdate} from './DataContext';
import {useToken} from './AuthContext';
import ConfirmedRequests from "./ConfirmedRequest";
function Home(){

    // pull the access token from the URL 
    const {id_token} = useParams();
    console.log('id_token', id_token);

    const {token, setToken} = useToken();   

    React.useEffect(() => {
        setToken(id_token); 
      }, [token]); 

    console.log('data in home', useData())
    const name = useData()['user']['name']
    
    const my_trip_confirmed = useData()['confirmed_request']
    console.log('confirmed_request', my_trip_confirmed)

    const confirmed = useData()['confirmed_request']['confirmed']

    return(
        <div>
            <img src = {logo} alt = {"logo"} height = {200} width = {300}/>
            <h1> Hi {name}! Welcome to project nimbus! </h1>

            { (confirmed)
                ? <ConfirmedRequests/> 
                : <div>
                    <MyTrips/>
                    <PendingRequests/>
                    <Trips/>
                </div> 
            }
        </div>
    )
}

export default Home