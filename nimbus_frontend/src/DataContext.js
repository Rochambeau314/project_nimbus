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

    const [data, setData] = useState({
        'user': {},
        'student': {},
        'other_trips': {},
        'user_trips': {},
    })

    
    //const id_token = useParams();
    //console.log("token", id_token)
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
    
    React.useEffect(() => {
        let data_store = data
        console.log("data_store before", data_store)
        
        axios.get(userURL, { headers: {"Authorization": `Token ${token}`} })
            .then((response) => {
            const user_data = response.data;
            console.log('user_data', user_data)
            //data_store['user'] = user_data
            })
            .catch(function (error) {
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  console.log(error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message);
                }
                console.log(error.config);
              });
    
        axios.get(studentURL, { headers: {"Authorization": `Token ${token}`} })
            .then((response) => {
            const student_data = response.data;
            console.log('student_data', student_data)
            //data_store['student'] = student_data
            })
            .catch(function (error) {
                if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
                } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                }
                console.log(error.config);
            });

        axios.get(tripURL, { headers: {"Authorization": `Token ${token}`} })
            .then((response) => {
            const trip_data = response.data;
            console.log('my trips', trip_data)
            //data_store['other_trips'] = trip_data
            })
            .catch(function (error) {
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  console.log(error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message);
                }
                console.log(error.config);
              });

        axios.get(newtripURL, { headers: {"Authorization": `Token ${token}`} })
            .then((response) => {
            const trip_data = response.data;
            console.log('trip_data', trip_data)
            //data_store['user_trips'] = trip_data
        })
        .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
          });
          
        console.log("data_store after", data_store)
        setData(data_store)
    }, []);

    return (
        <DataContext.Provider value = {data}>
            {children}
        </DataContext.Provider> 
    )
}

