import React, {useContext, useState, useMemo} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';

// on login, set the id token here

const AuthContext = React.createContext({
    token: '',
    setToken: () => {},
}) ;

export function useToken() {
    return useContext(AuthContext)
}


export function TokenProvider({children}){
    const [token, setToken] = useState(''); 
    const value = {token, setToken}

    return (
        <AuthContext.Provider value = {value}>
            {children}
        </AuthContext.Provider>
    )
}




