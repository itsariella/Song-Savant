import React from 'react';
import queryString from 'query-string';
import Directions from './Directions';
import '../App.css';


let defaultStyle = {
    color: 'ddd',
};

  {/* Narrow down a playlist */}
class Filter extends React.Component {
    render() {
      return (
        <div style={defaultStyle}>
          <img/>
          {/* <input type="text" onKeyUp={event => 
            this.props.onTextChange(event.target.value)}/> 
            */
          }
        </div>
      );
    }
  }

class Player extends React.Component {

    constructor(props){
        super(props);
        this.state={
          currentSongUrl: null,
          isLogged: false,
          count:0
        };
        this.handleAudio = this.handleAudio.bind(this);
        this.nextTrack = this.nextTrack.bind(this);
    } 

    nextTrack(songs) {
        let myCount = this.state.count
        if(songs.length > 0)
        {
            myCount++;
            while(songs[myCount].url == null)
            {
                myCount++;
            } 
        }
        this.setState({
            count:myCount,
            currentSongUrl:songs[myCount].url,
            
        }, () => console.log(this.state.currentSongUrl))

        console.log("nextTrack done")
    }

    handleAudio(songs) {
        console.log("handle audio start")
        let myCount = this.state.count
        if(songs.length > 0)
        {
            while(songs[myCount].url == null)
            {
                myCount++;
            } 
        }
        this.setState({
            count:myCount,
            currentSongUrl:songs[myCount].url,

        }, () => console.log("im setting state"))

        console.log("handle audio done")
    }
    
    //randomSongPlayer
    render() {
       
        let songs = this.props.selectedPlaylist
        console.log(songs)
       
        if(songs == null)
        {
            return <h2>Error! No playlists retrieved! </h2>
        }
        if(songs.length > 0)
        {
            if(this.state.currentSongUrl == null || this.state.currentSongUrl == '')
            {
                this.handleAudio(songs)
            } 
     
            return <audio className="audioPlayer" controls autoPlay src = {this.state.currentSongUrl} onEnded=
                {() => this.nextTrack(songs)}
        
            > {console.log(this.state.currentSongUrl)}</audio>
            
        }
        else{
            return <h2> Error! No songs retrieved! </h2>
        }
    }
}   

class Playlist extends React.Component {

    constructor(){
        super();
    }

    render() {
        let playlist = this.props.playlist
        return(
            <div>
                
                <img src={playlist.imageUrl} style={{width: '150px', height: '150px'}}/>

                <h3> {this.props.playlist.name} </h3>
                {/*
                
                <ul>
                    {this.props.playlist.songs.map(song =>
                        <li>{song.name} </li>
                    )}
                </ul>

                */}
                
                
            </div>
        );
    }
}

class Select extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serverData: {}, 
            filterString: '',
            songSelectedUrl: '',
            songsList: {},
            clicked: false,
            isEmptyState: true,
            isLogged: false,
            chosenPlaylist: '',
    };

        this.handlePlaylist = this.handlePlaylist.bind(this);
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
             {/*get song names, error may occur i url is null? */}   
            let playlistPromise = allTracksDataPromises.then(trackDatas => {
                trackDatas.forEach((trackData, i) => {
                    playlists[i].trackDatas = trackData.items
                    .map(item => item.track) 
                    .map(trackData => ({
                        name: trackData.name,
                        url: trackData.preview_url,
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
                   songs: item.trackDatas
                }
            })
        }))
    
    }

    handlePlaylist(playlist) {
       
        this.setState({
            clicked: true,
            isEmptyState: false,
            songsList: playlist.songs,
            filterString: playlist.name,
        });
        console.log("clicked")
        
    }

    render() {
        
        let playlistToRender = 
        this.state.user && 
        this.state.playlists 
            ? this.state.playlists.filter(playlist => {
                let matchesPlaylist = playlist.name.toLowerCase().includes(
                    this.state.filterString.toLowerCase())
                let matchesSong = playlist.songs.find(song => song.name.toLowerCase()
                .includes(this.state.filterString.toLowerCase()))
                return matchesPlaylist || matchesSong
            }) : []


        return (
        <div>
            {this.state.user ?
            <div>
                <p>
                    <h1>
                        Welcome, {this.state.user.name.split(" ").shift()}! 
                        {console.log(this.state.user)}
                    </h1>
                </p>   

            <Directions></Directions>

            {
                <div>
                    {this.state.clicked && <Player selectedPlaylist = {this.state.songsList}/>}
                    {this.state.isEmptyState && <h3> Select a playlist:  </h3> }
                </div>
            }

           {/* Renders playlist after using filter, learn to use shouldComponentUpdate */}
            <Filter onTextChange={text => {
                this.setState({filterString: text})
                }}/>
            {
            playlistToRender.map(playlist => 
                
                <button className="songCard" onClick={() => this.handlePlaylist(playlist)}>

                    {this.state.clicked && !this.state.isLogged ? this.setState(
                        { 
                            isLogged: true,
                        }): console.log(playlist)
                    }
                    
                    <Playlist playlist={playlist} />
                </button>
            )}
            
            </div> : <button onClick={() => {
            window.location = window.location.href.includes('localhost') 
              ? 'http://localhost:8888/login' 
              : 'heroku link here' }
          }
          style={{padding: '20px', 'font-size': '50px', 'margin-top': '20px'}}>Sign in with Spotify</button>
            }
        </div>
        );
    }
}

export default Select;
