import React from 'react';
import styles from '../App.css'


class Title extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
          <div id = "Title">
              <h1> <a href='http://localhost:8888/login'> SONG SAVANT </a> </h1>
          </div>
          
        );
      }
}

export default Title;
