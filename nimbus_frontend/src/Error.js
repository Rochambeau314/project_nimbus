import logo from './logo.svg';
import './App.css';
import Home from './Home.js';
import Welcome from './Welcome.js';
import NewUser from './NewUser.js';
import NewTrip from './NewTrip.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React, {useState, useMemo} from 'react';
import DateAdapter from '@mui/lab/AdapterDayjs';

function Error() {

  return (      
    <div>
        Oops! Not sure what happened. if this happens again, please contact an admin for support. Sorry for any inconvenience this may cause! 
    </div>
  );
}

export default Error;
