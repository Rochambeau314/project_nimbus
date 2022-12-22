import './App.css';
import ReactDOM from 'react-dom';
import React, {useState, useMemo} from 'react';
import logo from './nimbus_recolored.png';

function NimbusHeader() {

  return (      
    <div id='NimbusHeader'>
        <img src = {logo} alt = {"logo"} height = {50} width = {75} style= {{'display':'inline-block', 'verticalAlign':'middle'}}/>
        <h1 style= {{'verticalAlign':'middle', 'lineHeight':'50px', 'display':'inline-block'}}>Project Nimbus</h1>
    </div>
  );
}
export default NimbusHeader;
