import React from "react";
import SpotifyWebApi from "spotify-web-api-js";
const spotifyApi = new SpotifyWebApi();

export default class Spotify extends React.Component {

    constructor(){
        super();
        const params = this.getHashParams();
        const token = params.access_token;
        if (token) {
            spotifyApi.setAccessToken(token);
        }
        this.state = {
            loggedIn: token ? true : false,
            nowPlaying: { name: 'Not Checked', albumArt: '' },
            playlists: { id: '', collection: '', albumArt: ''},
            currSong: { name: '', url: '', artist: ''}
            
        }
      }

      componentDidMount () {

        const script = document.createElement("script");
  
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
    
        document.body.appendChild(script);
    }

      getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q)
        while (e) {
           hashParams[e[1]] = decodeURIComponent(e[2]);
           e = r.exec(q);
        }
        return hashParams;
      }
      getNowPlaying(){
        spotifyApi.getMyCurrentPlaybackState()
          .then((response) => {
            if(this.state)
            {
              this.setState({
                nowPlaying: { 
                    name: response.item.name, 
                    albumArt: response.item.album.images[0].url
                  }
              });
            }
            
          })
      }

      getTracks()
      {
        spotifyApi
          .getPlaylist(this.state.playlists.id)
          .then((data) => {
            console.log('user tracks', data);
            if(this.state)
            {
              this.setState({
                currSong: {
                  name: data.tracks.items[0].track.name,
                  url: data.tracks.items[0].track.preview_url,
                  //artist: data.tracks.items[0].artist.name
                }
              })
            }
           });
      }

      getPlaylist(){
        spotifyApi.getUserPlaylists()
          .then((data) => {
            console.log('user playlists', data);
            if(this.state)
            {
              this.setState({
                playlists: {
                  //numPlaylists: data.
                  id: data.items[0].id,
                  name: data.items[0].name,
                  collection: data,
                  albumArt: data.items[0].images[0].url
                }
              }) 
            }          
          }, function(err){
            console.error(err);
          })
      }

    render() {
        return (
          <div className='App'>
            <a href='http://localhost:8888'> Login to Spotify </a>
            <div>
                Now Playing: { this.state.nowPlaying.name }
            </div>
            <div>
                <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
            </div>
            { this.state.loggedIn &&
                <button onClick={() => this.getNowPlaying()}>
                Check Now Playing
                </button>
            }
            <div>
              Most Recent Playlist: { this.state.playlists.name}
            </div>
            <div>
              <img src = { this.state.playlists.albumArt} style={{ height: 150 }}/>
            </div>
            <div>
            <audio controls src = {this.state.currSong.url}> 
                    Your browser does not support the <code>audio</code> element.
            </audio>
            </div>
    
            { this.state.loggedIn &&
              <button onClick={() => this.getPlaylist()}>
              Get Most Recent Album
              </button>
            }
            <div>
            <button onClick={() => this.getTracks()}>
              Get Tracks
              </button>
            </div>
           
            
          </div>
          
        )
      }
}