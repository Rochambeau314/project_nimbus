import React, {useContext, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';

// current user data
const UserContext = React.createContext()
const id_token = 'da2b1cdfa6d7280a7ded4e50cbd04228f779bb85'
export function useData(){
    return useContext(UserContext)
}

export function DataProvider({children}) {

    //variable for trip data 
    const [trips, setTrips] = useState([])
    // pull all current trips from backend 
    const tripURL = `${'http://127.0.0.1:8000'}/my_trips`;

    // pull all current trips from backend 
    const [newtrips, setNewTrips] = useState([])
    const newtripURL = `${'http://127.0.0.1:8000'}/create_trip`;

    // variable for student data 
    const [student, setStudent] = useState([])    
    // pull current student data
    const studentURL = `${'http://127.0.0.1:8000'}/student_data`;

    // variable for user data 
    const [user, setUser] = useState([])   
    // pull user data from backend 
    const userURL = `${'http://127.0.0.1:8000'}/user_data`;

    React.useEffect(() => {
        axios.get(userURL, { headers: {"Authorization": `Token ${id_token}`} })
                .then((response) => {
                const user_data = response.data;
                setUser(user_data)
                console.log('user_data', user_data)
            });
            
        axios.get(studentURL, { headers: {"Authorization": `Token ${id_token}`} })
                .then((response) => {
                const student_data = response.data;
                console.log('student_data', student_data)
                setStudent(student_data)
            });

        axios.get(tripURL, { headers: {"Authorization": `Token ${id_token}`} })
            .then((response) => {
            const trip_data = response.data;
            setTrips(trip_data)
            console.log('my trips', trip_data)
        });

        axios.get(newtripURL, { headers: {"Authorization": `Token ${id_token}`} })
                .then((response) => {
                const trip_data = response.data;
                setNewTrips(trip_data)
                //console.log('trip_data', trip_data)
            });
    }, []);
    // current student data 
    // all trips 
    // user trips 

    return (
        <UserContext.Provider value = {user}>
            {children}
        </UserContext.Provider> 
    )
}

