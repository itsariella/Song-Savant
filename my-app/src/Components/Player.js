import React from "react"

export default class Player extends React.Component {

    constructor(props){
        super(props);
        this.state={
          currentSongUrl: null, 
          currentSongName: "",
          currentSongArtist: "",
          isLogged: false,
          totalCount:0,
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

    /*Generates a random number between min to max*/
    randomNumber(min, max) {  
        let myCount = parseInt(Math.random() * (max - min) + min); 
        let attemptNum = 0;
        while(this.arrNums.indexOf(myCount) !== -1 && attemptNum <= 5) {
            myCount = parseInt(Math.random() * (max - min) + min); 
        }
        this.arrNums.push(myCount);
        return myCount;
    } 

    /**Sets state for next track, previous track, input validation
    * @param songs array for which you want to set the next track
    *
    **/
    nextTrack(e,songs) {
        e.preventDefault();
        let myCount = this.randomNumber(0,songs.length-1)
        console.log(myCount)
        let matchesSong = this.state.currentSongName.normalize("NFD").toLowerCase().replace(/[.,'/?#!$%^&*;:{}=_`~\s]/g,"")
        this.setState({correct: false, submitted: true})
    
        if(songs.length > 0)
        {
            while(songs[myCount].url == null)
            {
                myCount=this.randomNumber(0,songs.length-1);
            } 
        }

        if(matchesSong[0] === ('('))
        {
            matchesSong = matchesSong.split(')')[1].trim();
        }
        else if(matchesSong.includes('('))
        {
            matchesSong = matchesSong.split('(')[0].trim();
        }
        if(matchesSong.includes('-'))
        {
            matchesSong = matchesSong.split('-')[0].trim();
        }
        
        if(this.myInput.value.normalize("NFD").toLowerCase().replace(/[.,'/?#!$%^&*;:{}=_`~\s]/g,"").trim() === matchesSong)
        {
            this.setState(
                {score: this.state.score + 1,
                correct: true
            
            }, () => console.log(this.state.score));
        }
        this.myInput.value = "";
        console.log(this.myInput.value);
        console.log(matchesSong);
        this.setState({
            previousSongName: this.state.currentSongName,
            totalCount: this.state.totalCount + 1,
            match: false,
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
            currPosition:myCount,
            currentSongUrl:songs[myCount].url,
            currentSongName: songs[myCount].name,
            correct: false    
        }, () => console.log("im setting state"))


        console.log("handle audio done")
    }
    
    render() {
       
        let songs = this.props.selectedPlaylist
       
        if(songs == null)
        {
            return <h2>Error! No playlists retrieved! </h2>
        }
        if(songs.length > 0)
        {
            if(this.state.currentSongUrl === null || this.state.currentSongUrl === '')
            {
                this.handleAudio(songs)
            } 
            
     
            return [<h2> Score: {this.state.score} / {this.state.totalCount} </h2>, 
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