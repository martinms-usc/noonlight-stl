import React, { Component } from 'react';
import './app.css';
import NoonlightStacked from './nl_stacked.png';

export default class App extends Component {
  state = { username: null };

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    console.log('rendering');
    
    const { username } = this.state;
    return (
      <div>
        {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
        <img src={NoonlightStacked} alt="noonlight" />
      </div>
    );
  }
}
