import React from 'react';
import queryString from 'query-string';
import styles from '../App.css'

let defaultStyle = {
    color: 'fff',
};

class Directions extends React.Component {
    render() {
      return (
        <div id = "Directions">
          <p>
                Here's how it works: Select a playlist. When the song plays, try to enter the title as fast as you can. See how many songs you can enter before time’s up!

          </p>
          <p>
                Test your knowledge! 
            </p>
        </div>
        
      );
    }
  }

class Instructions extends React.Component {

    constructor() {
        super();
        this.state = {
            serverData: {}, 
            filterString: ''
        }
    }

    componentDidMount(){
       let parsed = queryString.parse(window.location.hash); //gets access token
       let accessToken = parsed.access_token;
      
       if(!accessToken)
        return
       fetch('https://api.spotify.com/v1/me', {
         headers:{ 'Authorization': 'Bearer ' + accessToken
       }}).then(response => response.json())
       .then(data => this.setState({
           user: {
               name: data.display_name
           }
       }))

       fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {'Authorization': 'Bearer ' + accessToken}
        }).then(response => response.json())
        .then(data => this.setState({
        playlists: data.items.map(item => {
        console.log(data.items)
        return {
          name: item.name,
          imageUrl: item.images[0].url, 
          songs: []
        }
    })
    }))

        // setTimeout( () => {
        // this.setState({serverData: fakeServerData});
        // }, 1000);

    }

    render() {

        let playlistToRender = 
        this.state.user && 
        this.state.playlists 
            ? this.state.playlists.filter(playlist => 
            playlist.name.toLowerCase().includes(
                this.state.filterString.toLowerCase())) 
            : []

        return (
        <div className = "Heading">
            {this.state.user ?
            <div>
             <p>
                <h1 >
                    Welcome, {this.state.user.name}!
                    {console.log(this.state.user)}
                </h1>
            </p>   
            
            <Directions></Directions>
            
            </div> : <h2>Sign in</h2>
            }
        </div>
        );
    }
}

export default Instructions;
