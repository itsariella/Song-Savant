import React from 'react';
import queryString from 'query-string';


let defaultStyle = {
    color: 'ddd'
};

let fakeServerData = {
    user: {
        name: 'Ariella',
        playlists: [
        {
            name: 'My favorites',
            songs: [{name:'s1',duration:1}, {name:'s2', duration: 1}, {name:'s3', duration: 1}]
        },
        {
            name: 'Discovery Weekly',
            songs: [{name:'s4',duration:1}, {name:'s5', duration: 1}, {name:'s6', duration: 1}]
        },
        {
             name: 'Chill',
             songs: [{name:'s7',duration:1}, {name:'s8', duration: 1}, {name:'s9', duration: 1}]
        }
        ]
    }
}

class PlaylistCounter extends React.Component {
    render() {
        return(
            <div style={{...defaultStyle, width: "40", display: "inline-block"}}>
                <h2> {this.props.playlists && this.props.playlists.length} Playlists </h2>
            </div>

        );
    }
}

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

class Filter extends React.Component {
    render() {
      return (
        <div style={defaultStyle}>
          <img/>
          {/* <input type="text" onKeyUp={event => 
            this.props.onTextChange(event.target.value)}/> */}
        </div>
      );
    }
  }

class Playlist extends React.Component {
    render() {
        let playlist = this.props.playlist
        return(
            <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}>
                <img src={playlist.imageUrl} style={{width: '60px'}}/>
                <h3> {this.props.playlist.name} </h3>
                <ul>
                    {this.props.playlist.songs.map(song =>
                        <li>{song.name} </li>
                    )}
                </ul>
            </div>
        );
    }
}

class Decades extends React.Component {

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

       fetch('https://api.spotify.com/v1/browse/categories/decades/playlists', {
        headers: {'Authorization': 'Bearer ' + accessToken}
        }).then(response => response.json())
       .then(playlistData => {
           console.log(playlistData)
           let playlists = playlistData.playlists.items
           let trackDataPromises = playlists.map(playlist  => { 
               let responsePromise = fetch(playlist.tracks.href, { 
                headers: {'Authorization' : 'Bearer ' + accessToken}
               })
               let trackDataPromise = responsePromise
               .then(response => response.json())
               return trackDataPromise
            })
            let allTracksDataPromises 
                = Promise.all(trackDataPromises)
            let playlistPromise = allTracksDataPromises.then(trackDatas => {
                trackDatas.forEach((trackData, i) => {
                    playlists[i].trackDatas = trackData.items
                    .map(item => item.track) 
                    .map(trackData => ({
                        name: trackData.name,
                        duration: trackData.duration_ms / 1000
                    }))                   
                })
                return playlists
            })
            return playlistPromise
       })
       .then(playlists => this.setState({
           playlists: playlists.map(item => {
               return {
                   name: item.name,
                   imageUrl: item.images[0].url,
                   songs: item.trackDatas.slice(0,3)
                }
            })
        }))
    
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
        <div>
            {this.state.user ?
            <div>
                <p>
                    <h1 >
                        Welcome, {this.state.user.name}!
                        {console.log(this.state.user)}
                    </h1>
                </p>   
            <Directions></Directions>
           
            <Filter onTextChange={text => {
                this.setState({filterString: text})
                }}/>
            {playlistToRender.map(playlist => 
                <Playlist playlist={playlist} />
            )}
            </div> : <button onClick={() => {
            window.location = window.location.href.includes('localhost') 
              ? 'http://localhost:8888/login' 
              : 'https://better-playlists-backend.herokuapp.com/login' }
          }
          style={{padding: '20px', 'font-size': '50px', 'margin-top': '20px'}}>Sign in with Spotify</button>
            }
        </div>
        );
    }
}

export default Decades;
