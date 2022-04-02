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
    const tripURL = `${'http://127.0.0.1:8000'}/my_trips`; 
        
    //
    const newtripURL = `${'http://127.0.0.1:8000'}/create_trip`;
 
    // pull current student data
    const studentURL = `${'http://127.0.0.1:8000'}/student_data`;
 
    // pull user data from backend 
    const userURL = `${'http://127.0.0.1:8000'}/user_data`;

    // pull pending requests from backend 
    const pendingrequestsURL = `${'http://127.0.0.1:8000'}/rideshare_request`;

    const [data, setData] = useState({
        'user': {},
        'student': {},    
        'other_trips': {},
        'user_trips': {},     
        'pending_requests': {},
    })

    //console.log('data before useEffect', data)
    React.useEffect(() => {
        const fetchData = async () => {  
            const data = {
                'user': {},
                'student': {},    
                'other_trips': {},
                'user_trips': {},    
                'pending_requests': {},
            }
            const user = await axios.get(userURL, { headers: {"Authorization": `Token ${token}`} })
            console.log('user', user.data)
            data['user'] = user.data

            const student = await axios.get(studentURL, { headers: {"Authorization": `Token ${token}`} })
            console.log('student', student.data)
            data['student'] = student.data

            const user_trips = await axios.get(tripURL, { headers: {"Authorization": `Token ${token}`} })
            console.log('user_trips', user_trips.data)
            data['user_trips'] = user_trips.data

            const other_trips = await axios.get(newtripURL, { headers: {"Authorization": `Token ${token}`} })
            console.log('other_trips', other_trips.data)
            data['other_trips'] = other_trips.data

            const pending_requests = await axios.get(pendingrequestsURL, {headers: {"Authorization": `Token ${token}`} })
            const pending_requests_data = pending_requests.data
            console.log('pending_requests_context', pending_requests_data) 
            data['pending_requests'] = pending_requests.data  
            setData(data)
        }
        fetchData();
    }, [token]); 

    return (
        <DataContext.Provider value = {data}>
            {children}
        </DataContext.Provider> 
    )
}

