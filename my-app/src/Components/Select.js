import React from 'react';
import queryString from 'query-string';
import Timer from './Timer';
import Card from './Card';
import Player from './Player';
import Filter from './Filter';
import Directions from './Directions';
import '../App.css';


class Select extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serverData: {}, 
            categoryFilterString: '',
            playlistFilterString: '',
            songSelectedUrl: '',
            songsList: {},
            categoryClicked: false,
            clicked: false,
            isEmptyState: true,
            isLogged: false,
            catIsLogged: false,
            renderPlayer: false,
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

       fetch('https://api.spotify.com/v1/browse/categories?&limit=50', {
         headers:{ 'Authorization': 'Bearer ' + accessToken
       }}).then(response => response.json())
       .then(categoryData => {
        console.log(categoryData)
        let categories = categoryData.categories.items
        this.setState({
            categories: categories.map(item => {
                return {
                    name: item.name,
                    imageUrl: item.icons[0].url,
                    id: item.id
                    }
                })
            })
        })

    }

    handlePlaylist(playlist) {
       
        this.setState({
            clicked: true,
            isEmptyState: false,
            songsList: playlist.songs,
            playlistFilterString: playlist.name,
        });

        setTimeout(function() { //Start the timer
            this.setState({renderPlayer: true}) //After 1 second, set render to true
        }.bind(this), 3000)
        
    }

    handleCategory(category) {
        
        let parsed = queryString.parse(window.location.hash); //gets access token
        let accessToken = parsed.access_token;
        
        this.setState({
            categoryClicked: true,
            categoryId: category.id,
            categoryFilterString: 'removeCategory'
        });

        let url = 'https://api.spotify.com/v1/browse/categories/' + category.id + '/playlists?&limit=50'
        console.log(url)
        fetch(url, {
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

    render() {

        let categoryToRender = 
        this.state.user && 
        this.state.categories 
            ? this.state.categories.filter(category => {
                let matchesCategory = category.name.toLowerCase().includes(
                    this.state.categoryFilterString.toLowerCase())
                return matchesCategory
            }) : []

        
        let playlistToRender = 
        this.state.user && 
        this.state.playlists 
            ? this.state.playlists.filter(playlist => {
                let matchesPlaylist = playlist.name.toLowerCase().includes(
                    this.state.playlistFilterString.toLowerCase())
                return matchesPlaylist
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
            
            {
                <div>
                    {this.state.clicked && this.state.renderPlayer ? <Player elementId = "myPlayer" selectedPlaylist = {this.state.songsList}/> : this.state.categoryClicked && this.state.clicked ? <Timer myTimer/> : null}
                    {!this.state.categoryClicked && <h3> Select a category:  </h3> }
                    {this.state.categoryClicked && this.state.isEmptyState && <h3> Select a playlist:  </h3> }
                   
                </div>
            }
            
            <Filter onTextChange={text => {
                this.setState({categoryFilterString: text, playlistFilterString: text})
            }}/>
            {categoryToRender.map(category => 
                
                    <button className="songCard" onClick={() => this.handleCategory(category)}>
    
                        {this.state.categoryClicked && !this.state.catIsLogged ? this.setState(
                            { 
                                catIsLogged: true,
                            }): console.log(category)
                        }
                        <Card card={category} />
                    </button>
                )
            }
            
            { this.state.categoryClicked ? playlistToRender.map(playlist => 
                <button className="songCard" onClick={() => this.handlePlaylist(playlist)}>

                    {this.state.clicked && !this.state.isLogged ? this.setState(
                        { 
                            isLogged: true,
                        }): console.log("no playlists")
                    }
                    <Card card={playlist} />
                </button>
            ) : console.log("unclicked")} 
            </div> : [<div> Welcome... </div>, <button onClick={() => {
            window.location = window.location.href.includes('localhost') 
              ? 'http://localhost:8888/login' 
              : 'heroku link here' }
          }
          style={{padding: '20px', 'font-size': '50px', 'margin-top': '20px'}}>Sign in with Spotify</button>]
            }
        </div>
        );
    }
}

export default Select;
