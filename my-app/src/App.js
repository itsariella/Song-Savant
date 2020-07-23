import React, { Component } from 'react';
import './App.css'
import Select from './Components/Select'
import Title from './Components/Title'
import Directions from './Components/Directions'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

class App extends React.Component {

    render() {
        return (
        <div className ="App">
            <Router>
                <Title></Title>
                
                <Switch>
                    <Route exact path="/" component = {Select}/>

                </Switch>
            </Router>
            {/*Need to use React Router, show playlist selection, audio-game on different pages
            
            Click button -> store array to player props

            button also links to new page

            new page creates audio player

            ideally:

            <Nav bar>
            <Router>
            -choose playlisst
            -audio game page
            

            <Router>

            */}

        </div>
        );
    }
}

export default App;
