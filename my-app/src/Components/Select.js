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
          currentSongName: "",
          currentSongArtist: "",
          isLogged: false,
          count:0,
          score: 0,
          correct: false,
          submitted: false,
          
        };
        this.handleAudio = this.handleAudio.bind(this);
        this.nextTrack = this.nextTrack.bind(this);
        this.randomNumber = this.randomNumber.bind(this);
        this.myInput = React.createRef();
        this.arrNums = [];
    } 

    randomNumber(min, max) {  
        let myCount = parseInt(Math.random() * (max - min) + min); 
        while(this.arrNums.indexOf(myCount) != -1) {
            myCount = parseInt(Math.random() * (max - min) + min); 
        }
        this.arrNums.push(myCount);
        return myCount;
    } 

    nextTrack(e,songs) {
        e.preventDefault();
        let myCount = this.randomNumber(0,songs.length-1)
        console.log(myCount)
        let matchesSong = this.state.currentSongName.normalize("NFD").toLowerCase().replace(/[.,'\/?#!$%\^&\*;:{}=\_`~\s]/g,"")
        this.setState({correct: false, submitted: true})
    
        if(songs.length > 0)
        {
            while(songs[myCount].url == null)
            {
                myCount=this.randomNumber(0,songs.length-1);
            } 
        }
        if(matchesSong.includes('-'))
        {
            matchesSong = matchesSong.split('-')[0].trim();
        }
        else if(matchesSong.includes('('))
        {
            matchesSong = matchesSong.split('(')[0].trim();
        }
        
        if(this.myInput.value.normalize("NFD").toLowerCase().replace(/[.,'\/?#!$%\^&\*;:{}=\_`~\s]/g,"").trim() == matchesSong)
        {
            this.setState(
                {score: this.state.score + 1,
                correct: true
            
            }, () => console.log(this.state.score));
        }
        this.setState({previousSongName: this.state.currentSongName});
        this.myInput.value = "";
        console.log(this.myInput.value);
        console.log(matchesSong);
        this.setState({
            match: false,
            count:myCount,
            currentSongUrl:songs[myCount].url,
            currentSongName: songs[myCount].name,
            
        }, () => console.log(songs[myCount].name))

        console.log("nextTrack done")
    }

    handleAudio(songs) {
        console.log("handle audio start")
        let myCount = this.randomNumber(0,songs.length-1)
        console.log(myCount)
        if(songs.length > 0)
        {
            while(songs[myCount].url == null)
            {
                myCount = this.randomNumber(0,songs.length-1);
            } 
        }
        this.setState({
            count:myCount,
            currentSongUrl:songs[myCount].url,
            currentSongName: songs[myCount].name,
            correct: false    
        }, () => console.log("im setting state"))


        console.log("handle audio done")
    }
    
    //randomSongPlayer
    render() {
       
        let songs = this.props.selectedPlaylist
       
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
            
     
            return [<h2> Score: {this.state.score} </h2>,
                    <audio className="audioPlayer" controls autoPlay src = {this.state.currentSongUrl} onEnded=
                        {(e) => this.nextTrack(e,songs)}> {console.log(this.state.currentSongUrl)}
                    </audio>, 
                    <div> {
                    <form onSubmit = {(e) => this.nextTrack(e,songs)}>
                        <input
                            ref={input => {this.myInput = input;}} 
                            placeholder="Enter song name"
                            autoFocus>

                        </input>
                        <button type="submit"> submit </button>
                    </form>} 
                    </div>, <div>{this.state.submitted? this.state.correct ? <h5> Good job!</h5>: <h5> Not quite... </h5> : null}</div>, this.state.submitted? <h4> Previous song:  {this.state.previousSongName} </h4> : null
                    ]
            
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
            category: ""
    };

        this.handlePlaylist = this.handlePlaylist.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
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

       fetch('https://api.spotify.com/v1/browse/categories', {
         headers:{ 'Authorization': 'Bearer ' + accessToken
       }}).then(response => response.json())
       .then(data => {
        console.log(data)
       }
           
       )

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

    handleCategory(category) {
        this.setState({
            category: 'https://api.spotify.com/v1/browse/categories/'+{category}+'/playlists'});
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

            var self = this;

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

            {/* <ul>
                <li><button onClick={function(){this.handleCategory('decades')}}>decades</button></li>
                <li><button onClick={function(){this.handleCategory('pop')}}>pop</button></li>
                <li><button onClick={function(){this.handleCategory('hiphop')}}>hip hop</button></li>
                <li><button onClick={function(){this.handleCategory('country')}}>country</button></li>
                <li><button onClick={function(){this.handleCategory('rock')}}>rock</button></li>
                <li><button onClick={function(){this.handleCategory('rnb')}}>rnb</button></li>
                <li><button onClick={function(){this.handleCategory('tophits')}}>top hits</button></li>
                
            </ul> */}

            {
                <div>
                    {this.state.clicked && <Player elementId = "myPlayer" selectedPlaylist = {this.state.songsList}/>}
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
