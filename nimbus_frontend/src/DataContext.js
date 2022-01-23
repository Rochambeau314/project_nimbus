import React, {useContext, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from './nimbus_recolored.png'; 
import { DataGrid } from '@mui/x-data-grid';
import {useToken} from './AuthContext';

// current user data
const DataContext = React.createContext()  
  
export function useData(){  
    return useContext(DataContext) 
}

export function DataProvider({children}) {  


    const {token} = useToken()       
    console.log('id_token in datacontext', token)
    
    // pull all current trips from backend 
    const [user_trip, setUserTrip] = useState({})
    const tripURL = `${'http://127.0.0.1:8000'}/my_trips`; 
        
    //
    const [all_trips, setAllTrips] = useState({})
    const newtripURL = `${'http://127.0.0.1:8000'}/create_trip`;
 
    // pull current student data
    const [student, setStudent] = useState({})
    const studentURL = `${'http://127.0.0.1:8000'}/student_data`;
 
    // pull user data from backend 
    const [user, setUser] = useState({})
    const userURL = `${'http://127.0.0.1:8000'}/user_data`;

    const [data, setData] = useState({
        'user': user,
        'student': student,    
        'other_trips': all_trips,
        'user_trips': user_trip,     
    })

    //console.log('data before useEffect', data)
    React.useEffect(() => {
        const new_data = { 
            'user': [],
            'student': [], 
            'other_trips': [],
            'user_trips': [],}

        console.log('useEffect start')

        axios.get(userURL, { headers: {"Authorization": `Token ${token}`} })
            .then((response) => {
            const user_data = response.data;
            //console.log('user_data', user_data) 
            setUser(prevUser => user_data) 
            new_data['user'] = user_data
            })
            .catch(function (error) {
              }); 
        console.log('new_data user', new_data['user'])

        axios.get(studentURL, { headers: {"Authorization": `Token ${token}`} })
            .then((response) => {
            const student_data = response.data;
            //console.log('student_data', student_data)
            setStudent(student_data)
            new_data['student'] = student_data
            setUserTrip(prevStudent => student_data)
            })
            .catch(function (error) {
            });
        console.log('new_data student', new_data['student'])

        axios.get(tripURL, { headers: {"Authorization": `Token ${token}`} })
            .then((response) => {
            const trip_data = response.data;
            //console.log('my trips', trip_data)
            setUserTrip(prevUser_trip => trip_data)
            new_data['user_trips'] = trip_data
            })  
            .catch(function (error) {
              });  
        console.log('new_data user_trips', new_data['user_trips'])

        axios.get(newtripURL, { headers: {"Authorization": `Token ${token}`} })
            .then((response) => {
            const trip_data = response.data;
            //console.log('trip_data', trip_data)
            setAllTrips(prevAll_trips => trip_data)
            new_data['other_trips'] = trip_data
        })
        .catch(function (error) {
          }); 
        
        console.log('other_trips user_trips', new_data['other_trips'])

        console.log("new data", new_data)    
        setData(new_data)
        console.log("useEffect stop")

    }, [token]); 

    return (
        <DataContext.Provider value = {data}>
            {children}
        </DataContext.Provider> 
    )
}

