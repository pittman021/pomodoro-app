import React, { Component } from 'react';
import Button from './button';
import axios from 'axios';

class TimerOnline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBreak: false,
      isOn: false,
      duration: 1000 * 60 * 0.1,
      remaining: 0,
      minutes: 25,
      seconds: '00',
      intervalId: ''
    };
  }

  playMusic() {
    const music = document.querySelector('#music');
    music.play();
  }

  pauseMusic() {
    const music = document.querySelector('#music');
    music.pause();
  }

  // This function is used to start clock or resume clock.
  // if 'remaining' is set to greater than 0, its been paused and will be used for duration
  // if not, standard 'duration' will be used.
  startClock() {
    // get the time remaining. use duration if remaining is not set
    const timeRemaining = this.state.remaining > 0 ? this.state.remaining : this.state.duration;
    // get time the clock was started or resumed
    const startTime = new Date();
    // get the new endtime.
    const endTime = startTime.getTime() + timeRemaining;

    this.ticker(endTime);
  }

  ticker(endTime) {
    const intervalId = setInterval(() => {
      const remaining = endTime - Date.parse(new Date());
      if (remaining > 0) {
        const minutes = Math.floor((remaining / 1000 / 60) % 60).toString();
        const seconds = Math.floor((remaining / 1000) % 60).toString();
        document.title = `Pomz - ${minutes}:${seconds}`;
        this.setState({
          remaining: remaining,
          isOn: true,
          seconds: seconds,
          minutes: minutes,
          intervalId: intervalId
        });
      } else {
        this.endClock();
      }
    }, 1000);
  }

  endClock() {
    if (!this.state.isBreak) {
      // play ending sound //
      this.playMusic();

      // clearInterval //
      clearInterval(this.state.intervalId);

      // record pom //
      axios.post('/api/pom/new').then(res => {
        if (res.data) {
          this.setState(
            {
              minutes: 1,
              remaining: 1000 * 60 * 5,
              seconds: '00',
              break: true
            },
            () => {
              this.startClock();
            }
          );
        }
      });
    } else {
      // clear ticking interval again //
      clearInterval(this.state.intervalId);

      // reset timer & get it going again :) //
      this.setState({
        isOn: false,
        duration: 1000 * 60 * 25,
        remaining: 0,
        minutes: 25,
        seconds: '00'
      });
    }
  }

  pauseClock() {
    clearInterval(this.state.intervalId);
    const remaining = this.state.endTime - Date.parse(new Date());
    this.setState({
      duration: remaining,
      intervalId: null,
      isOn: false
    });
  }

  resetClock() {
    clearInterval(this.state.intervalId);
    this.setState(
      {
        isOn: false,
        duration: 1000 * 60 * 25,
        remaining: 0,
        minutes: 25,
        seconds: '00',
        intervalId: null
      },
      () => {
        document.title = this.state.minutes + ':' + this.state.seconds;
      }
    );
  }

  renderClockButtons() {
    if (this.state.isOn === false) {
      return <Button value="Start" clickHandler={this.startClock.bind(this)} />;
    } else {
      return <Button value="Pause" clickHandler={this.pauseClock.bind(this)} />;
    }
  }

  render() {
    return (
      <div className="timer column">
        <div className="timer-time">
          <span className="minutes">{this.state.minutes}</span>:
          <span className="seconds"> {this.state.seconds}</span>
        </div>
        <div>
          {this.renderClockButtons()}
          <Button value="Stop" clickHandler={this.resetClock.bind(this)} />
        </div>
      </div>
    );
  }
}

export default TimerOnline;
