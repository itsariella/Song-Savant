import React, { Component } from 'react';
import './App.css'
import Select from './Components/Select'
import Instructions from './Components/Instructions'
import Title from './Components/Title'

class App extends React.Component {

    render() {
        return (
        <div className ="App">
            <Title></Title>
            <Select></Select>
            

        </div>
        );
    }
}

export default App;
