import React, { Component } from 'react';

class DeleteIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false
    };
  }

  renderIcon() {
    if (this.state.clicked === true) {
      return <i className="fa fa-trash fa-lg red" />;
    } else {
      return <i className="fa fa-trash fa-lg" />;
    }
  }

  handleClick(id) {
    if (this.state.clicked === false) {
      this.setState({
        clicked: true
      });
    } else {
      this.props.onDeleteTask(id);
    }
  }

  render() {
    return <a onClick={() => this.handleClick(this.props.id)}>{this.renderIcon()}</a>;
  }
}

export default DeleteIcon;
