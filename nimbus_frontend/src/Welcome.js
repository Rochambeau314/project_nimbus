import React, {useContext} from "react";
import Login from './Login.js';
import logo from './nimbus_recolored.png';

function Welcome(){

    return(
        <div> 
            <h2> Project Nimbus </h2>
            <img src = {logo} alt = {"logo"} height = {100} width = {150}/>
            <h5>Safe and Efficient Rideshare Carpooling</h5>
            <h5>Created at Vandy</h5>
            <Login/>    
    </div>
    )
    
}

export default Welcome