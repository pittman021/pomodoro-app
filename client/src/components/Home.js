import React, { Component } from 'react';
import Tasks from './Tasks';
import Timer from './timer';
import TasksOnline from './Tasks_Online';
import TimerOnline from './timer_online';
import axios from 'axios';

class Home extends Component {
  constructor() {
    super();

    this.state = {
      user: false,
      tasks: [],
      pomz: []
    };
    this.fetchData();
  }

  fetchData() {
    axios.get('/api/current_user').then(data => {
      if (data.data._id) {
        axios.get('/api/tasks').then(tasks => {
          this.setState({
            tasks: tasks.data,
            user: data.data._id
          });
        });
      } else {
        const cached = JSON.parse(localStorage.getItem('tasks')) || '';
        if (cached) {
          this.setState({
            user: 'none',
            tasks: cached
          });
        }
      }
    });
  }

  renderTaskView() {
    if (this.state.user === null) {
      return <div>Loading ... </div>;
    }
    if (this.state.user === 'none') {
      return (
        <div>
          <Timer />
          <Tasks tasks={this.state.tasks} />
        </div>
      );
    } else {
      return (
        <div>
          <TimerOnline />
          <TasksOnline user={this.state.user} tasks={this.state.tasks} />
        </div>
      );
    }
  }

  render() {
    return <div>{this.renderTaskView()}</div>;
  }
}

export default Home;
