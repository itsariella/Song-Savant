import React from "react";
import '../App.css';

export default class Timer extends React.Component {

constructor(){
    super();

    this.state = {
        time: 3,
        started: false
    }

    this.countdown = this.countdown.bind(this);
}

componentDidMount() {
  this.interval = setInterval(() => 
    this.countdown(this.interval),1000
  );
}

componentWillUnmount() {
  if (this.interval) {
     clearInterval(this.interval);
  }
}

countdown(){
    if(this.state.time == null)
    {
        console.log("NULL")
    }
    let myTime = this.state.time
    console.log(myTime)
    if(myTime > 0) {
        myTime--;
        this.setState({time: myTime})
    } else if(!this.state.started) {
        this.setState({time: 120, started: true})
    } else {
        clearInterval(this.interval)
    }

    return myTime;
}

render() {
  return (
    <div id = "Timer">
        {!this.state.started? <p> Game starts in {this.state.time} . . .</p> : <p id = "gameTimer"> {this.state.time} </p> }
      
    </div>
  );
}
}