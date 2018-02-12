import React, { Component } from 'react';
import '../App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import axios from 'axios';

import Header from './Header';
import Home from './Home';
import Stats from './Stats';
import About from './About';

// import ConfigItem from './config_icon';

class App extends Component {
  constructor() {
    super();

    this.state = {
      user: ''
    };

    this.fetchUser();
  }

  fetchUser() {
    axios.get('/api/current_user').then(data => {
      this.setState({
        user: data.data
      });
    });
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Route render={() => <Header user={this.state.user} />} />
            <Route exact path="/" component={Home} />
            <Route exact path="/stats" render={() => <Stats user={this.state.user} />} />
            <Route exact path="/config" render={() => <config user={this.state.user} />} />
            <Route exact path="/about" component={About} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
