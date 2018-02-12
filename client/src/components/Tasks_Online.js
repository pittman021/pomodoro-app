import React, { Component } from 'react';
import TaskInput from './task_input';
import TaskList from './task_list';
import axios from 'axios';

class TasksOnline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
      tasks: props.tasks,
      taskView: 'open'
    };
  }

  /// --- Add & Delete Tasks ---  //

  addTask(event) {
    event.preventDefault();
    const task = event.target.elements.taskname.value;
    const tasks = this.state.tasks;
    const newTask = {
      task: task,
      status: 'Open',
      created: new Date(),
      completed: null,
      owner: this.state.user
    };
    axios
      .post('/api/tasks/new', newTask)
      .then(res => {
        newTask._id = res.data._id;
        tasks.push(newTask);
        this.setState({
          tasks: tasks,
          taskView: 'open'
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  removeTask(task) {
    const state = this.state.tasks;
    const newTask = task;
    axios({
      method: 'delete',
      url: '/api/tasks/delete',
      data: { task: newTask }
    }).then(res => {
      const newState = state.filter(function(existingTask) {
        return existingTask['_id'] !== res.data._id;
      });
      this.setState({
        tasks: newState
      });
    });
  }

  // --- Change Task Status, open or closed --- //

  openTask(task) {
    const state = this.state.tasks;

    axios({
      method: 'post',
      url: '/api/tasks/open',
      data: { task: task }
    }).then(res => {
      const index = state.findIndex(function(existingTask) {
        return existingTask['_id'] === res.data._id;
      });
      state[index].status = 'Open';
      this.setState({
        tasks: state
      });
    });
  }

  completeTask(task) {
    const state = this.state.tasks;

    axios({
      method: 'post',
      url: '/api/tasks/close',
      data: { task: task }
    }).then(res => {
      console.log(res);
      const index = state.findIndex(function(existingTask) {
        return existingTask['_id'] === res.data._id;
      });
      state[index].status = 'Closed';
      this.setState({
        tasks: state
      });
    });
  }

  // --- Render TaskView for Panel Heading --- //

  // Getting the correct list of tasks, per taskView status //
  renderTasks() {
    if (this.state.taskView === 'all') {
      return this.state.tasks;
    }
    if (this.state.taskView === 'open') {
      return this.state.tasks.filter(function(task) {
        return task['status'] !== 'Closed';
      });
    }
    if (this.state.taskView === 'closed') {
      return this.state.tasks.filter(function(task) {
        return task['status'] !== 'Open';
      });
    }
  }

  // --- Changing TaskView status, to retrive correct list of tasks ---  //
  changeTaskView(event) {
    const taskId = event.target.id;
    this.setState({
      taskView: taskId
    });
  }

  // Incomplete. Pending updates //
  editTask(task) {
    // const state = this.state.tasks;
    // const modal = document.querySelector('.modal');
    // modal.setAttribute('class', 'modal is-active');
    // return <ConfirmModal task={task} />;
  }

  render() {
    if (this.state.tasks === '') {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="tasks column">
          <TaskInput onTaskSubmit={this.addTask.bind(this)} />

          <TaskList
            activeFilter={this.state.taskView}
            onEditTask={this.editTask.bind(this)}
            onChangeTaskView={this.changeTaskView.bind(this)}
            onOpenTask={this.openTask.bind(this)}
            onDeleteTask={this.removeTask.bind(this)}
            onCompleteTask={this.completeTask.bind(this)}
            tasks={this.renderTasks()}
          />
        </div>
      );
    }
  }
}
export default TasksOnline;
