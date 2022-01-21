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
const DataUpdateContext = React.createContext()


export function useData(){
    return useContext(DataContext)
}

export function useDataUpdate() {
    return useContext(DataUpdateContext)
}

export function DataProvider({children}) {  
    let initial_data = [{
        user: {},
        student: {},
        other_trips: {},
        user_trips: {}, 
    }]

    const [data, setData] = useState(initial_data)
    
    function updateData(){
        let data_store = data

        //const id_token = useParams();
        //console.log("token", id_token)
        const id_token = 'da2b1cdfa6d7280a7ded4e50cbd04228f779bb85'
        // pull all current trips from backend 
        const tripURL = `${'http://127.0.0.1:8000'}/my_trips`;
        
        //
        const newtripURL = `${'http://127.0.0.1:8000'}/create_trip`;
 
        // pull current student data
        const studentURL = `${'http://127.0.0.1:8000'}/student_data`;
 
        // pull user data from backend 
        const userURL = `${'http://127.0.0.1:8000'}/user_data`;
        

        axios.get(userURL, { headers: {"Authorization": `Token ${id_token}`} })
            .then((response) => {
            const user_data = response.data;
            data_store['user'] = user_data
            //console.log('user_data', user_data)
        })

                
        axios.get(studentURL, { headers: {"Authorization": `Token ${id_token}`} })
            .then((response) => {
            const student_data = response.data;
            console.log('student_data', student_data)
            data_store['student'] = student_data
        })


        axios.get(tripURL, { headers: {"Authorization": `Token ${id_token}`} })
            .then((response) => {
            const trip_data = response.data;
            data_store['other_trips'] = trip_data
            //console.log('my trips', trip_data)
        })


        axios.get(newtripURL, { headers: {"Authorization": `Token ${id_token}`} })
            .then((response) => {
            const trip_data = response.data;
            data_store['user_trips'] = trip_data
            //console.log('trip_data', trip_data)
        });
        setData(data_store)
        console.log('new data!', data)
    }
    

    return (
        <DataContext.Provider value = {data, setData}>
            <DataUpdateContext.Provider value = {updateData}>
                {children}
            </DataUpdateContext.Provider>
        </DataContext.Provider> 
    )
}

