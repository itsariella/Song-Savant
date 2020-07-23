import React from "react";

export default class Timer extends React.Component {

constructor(){
    super();

    this.state = {
        time: 3,
        done:false
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

isDone(){
    return this.state.done
}
countdown(){
    if(this.state.time == null)
    {
        console.log("NULL")
    }
    let myTime = this.state.time
    
    if(myTime > 0) {
        myTime--;
        this.setState({time: myTime})
        console.log(myTime)
    } else {
        clearInterval(this.interval)
        this.setState({done: true})
    }

    return myTime;
}

render() {
  return (
    <div id = "Timer">
      <p>
          Game starts in {this.state.time} . . .
      </p>
    </div>
  );
}
}