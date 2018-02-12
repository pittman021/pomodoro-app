import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: 'home'
    };
  }

  checkCurrentPage(page) {
    if (this.state.isActive !== page) {
      return;
    } else {
      return 'is-active';
    }
  }

  updateView(page) {
    this.setState({
      isActive: page
    });
  }

  renderContent() {
    if (!this.props.user) {
      return (
        <li>
          <a href="/auth/google">Login</a>
        </li>
      );
    } else {
      return [
        <li className={this.checkCurrentPage('stats')} key="1">
          <Link onClick={() => this.updateView('stats')} to="/stats">
            Stats
          </Link>
        </li>,
        <li className={this.checkCurrentPage('config')} key="2">
          <Link onClick={() => this.updateView('config')} to="/config">
            Config
          </Link>
        </li>,
        <li key="3">
          <a href="/api/logout">Logout</a>
        </li>
      ];
    }
  }
  render() {
    return (
      <div className="tabs is-centered">
        <ul>
          <li className={this.checkCurrentPage('home')}>
            <Link onClick={() => this.updateView('home')} to="/">
              Home
            </Link>
          </li>
          <li className={this.checkCurrentPage('about')}>
            <Link onClick={() => this.updateView('about')} to="/about">
              About
            </Link>
          </li>
          {this.renderContent()}
        </ul>
      </div>
    );
  }
}

export default Header;
