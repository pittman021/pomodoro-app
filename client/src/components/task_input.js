import React, { Component } from 'react';

class TaskInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      tagTitle: ''
    };
  }

  onTagChange(event) {
    event.preventDefault();
    this.setState({ tagTitle: event.target.value });
  }

  onInputChange(event) {
    event.preventDefault();
    this.setState({ title: event.target.value });
  }

  onHandleSubmit(event) {
    this.setState({ title: '' });
    this.props.onTaskSubmit(event);
  }

  render() {
    return (
      <form className="is-gapless field is-horizontal" onSubmit={event => this.onHandleSubmit(event)}>
        <div className="column">
          <p className="field-body">
            <input
              placeholder="Add A Task"
              name="taskname"
              className="input is-large"
              value={this.state.title}
              onChange={event => this.onInputChange(event)}
            />
          </p>
        </div>
      </form>
    );
  }
}

export default TaskInput;
