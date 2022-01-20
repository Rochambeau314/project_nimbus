import React, {useContext} from "react";
import Login from './Login.js';

import logo from './nimbus_recolored.png';


function Welcome(){

    return(
        <div> 
            <img src = {logo} alt = {"logo"} height = {200} width = {300}/>
            <h1> welcome to project nimbus! </h1>
            <Login/>    
    </div>
    )
    
}

export default Welcome