import logo from './logo.svg';
import './App.css';
import Home from './Home.js';
import Welcome from './Welcome.js';
import NewUser from './NewUser.js';
import NewTrip from './NewTrip.js';
import Error from './Error.js';
import Trips from './Trips.js';
import RideShare from './RideShare.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React, {useState, useMemo} from 'react';
import {DataProvider} from './DataContext.js';
import {TokenProvider} from './AuthContext.js';

function App() {
  return (      
    <div className="App">
    <TokenProvider>
        <DataProvider>
          <Routes>
              <Route path = '' element ={<Welcome />} />
              <Route path = 'Home/:id_token' element = {<Home />} />
              <Route path = 'Trips/:id_token' element = {<Trips />} />
              <Route path = 'NewUser/:id_token' element = {<NewUser />} />
              <Route path = 'NewTrip/:id_token' element = {<NewTrip />} />
              <Route path = 'RideShare/:name/:id_token' element = {<RideShare />} />
              <Route path = 'Error/:id_token' element = {<Error />} />
          </Routes>
        </DataProvider>
      </TokenProvider>    
    </div>
  );
}

export default App;
