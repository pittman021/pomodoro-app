import React, { Component } from 'react';

class ConfigItem extends Component {
  constructor(props) {
    super(props);
  }

  onConfigClick(event) {}

  render() {
    return <a onClick={() => this.onConfigClick()}>Cofig</a>;
  }

  // const configModal = () => {
  // 	return (
  //
  // 	)
}

export default ConfigItem;
