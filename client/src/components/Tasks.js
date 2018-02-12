import React, { Component } from 'react';
import TaskInput from './task_input';
import TaskList from './task_list';
import axios from 'axios';

class Tasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: props.tasks,
      taskView: 'open',
      user: ''
    };
  }

  /// --- Add & Delete Tasks ---  //

  addTask(event) {
    event.preventDefault();
    const task = event.target.elements.taskname.value;
    const tasks = this.state.tasks;
    const id = Date.now();
    const newTask = {
      _id: id,
      task: task,
      status: 'Open',
      created: new Date(),
      completed: null
    };
    tasks.push(newTask);
    this.setState({
      tasks: tasks,
      taskView: 'open'
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  removeTask(task) {
    const state = this.state.tasks;

    const newState = state.filter(function(existingTask) {
      return existingTask['id'] !== task;
    });
    this.setState({
      tasks: newState
    });
    localStorage.setItem('tasks', JSON.stringify(newState));
  }

  // --- Change Task Status, open or closed --- //

  openTask(task) {
    const state = this.state.tasks;
    const index = state.findIndex(function(existingTask) {
      return existingTask['id'] === task;
    });

    state[index].status = 'Open';
    this.setState({
      tasks: state
    });
    localStorage.setItem('tasks', JSON.stringify(state));
  }

  completeTask(task) {
    const state = this.state.tasks;
    const index = state.findIndex(function(existingTask) {
      return existingTask['id'] === task;
    });
    state[index].status = 'Closed';
    state[index].completed = new Date();

    this.setState({
      tasks: state
    });
    localStorage.setItem('tasks', JSON.stringify(state));
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
    if (this.props.user && this.props.user.length === 0) {
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
export default Tasks;
