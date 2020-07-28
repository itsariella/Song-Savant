import React from "react";
import '../App.css';

export default class Timer extends React.Component {

constructor(props){
    super(props);

    let time = this.props.limit
    this.state = {
        TIME_LIMIT: time,
        started: false,
        timeLeft: time,
        timePassed: 0
    }

    this.formatTimeLeft = this.formatTimeLeft.bind(this);
    this.calculateTimeFraction = this.calculateTimeFraction.bind(this);
    this.setCircleDasharray = this.setCircleDasharray.bind(this);
    this.onTimesUp = this.onTimesUp.bind(this);
    
}

componentDidMount() {
  this.interval = setInterval(() => 
     this.startTimer(this.interval),1000
   );
}

componentWillUnmount() {
  if (this.interval) {
     clearInterval(this.interval);
  }
}

formatTimeLeft(time) {
  // The largest round integer less than or equal to the result of time divided being by 60.
  const minutes = Math.floor(time / 60);
  
  // Seconds are the remainder of the time divided by 60 (modulus operator)
  let seconds = time % 60;
  
  // If the value of seconds is less than 10, then display seconds with a leading zero
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  // The output in MM:SS format
  return `${minutes}:${seconds}`;
}

startTimer() {

    if(this.state.timeLeft > 0)
    {
      this.setState({
        timePassed: this.state.timePassed += 1,
        timeLeft: this.state.TIME_LIMIT - this.state.timePassed,
        remainingPathColor: "base-timer__path-remaining green"
      });
    }
    if(this.state.timeLeft === 0){
      this.onTimesUp();
    }
    
    this.setCircleDasharray();
    
}

onTimesUp(){
  clearInterval(this.interval)
}

calculateTimeFraction() {
  let rawTimeFraction = this.state.timeLeft / this.state.TIME_LIMIT;
  return rawTimeFraction - (1 / this.state.TIME_LIMIT) * (1 - rawTimeFraction);
}

setCircleDasharray() {
  let circleDasharray = `${(
    this.calculateTimeFraction() * 283
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

render() {
  
  return (
    <div id="base-timer">
        <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g className="base-timer__circle">
            <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
              id="base-timer-path-remaining"
              stroke-dasharray= "283"
              className= {this.state.remainingPathColor}
              d="
                  M 50,50
                  m -45,0
                  a 45,45 0 1,0 90,0
                  a 45,45 0 1,0 -90,0
                "
            ></path>
          </g>
        </svg>
      <span id="base-timer-label" className="base-timer__label">
        {this.formatTimeLeft(this.state.timeLeft)}
      </span>
    </div>
  );
}
}