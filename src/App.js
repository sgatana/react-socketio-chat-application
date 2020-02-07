import React, { Component } from 'react';
import SignIn from './components/SignIn';
import Layout from './components/Layout';
import io from 'socket.io-client';
import { USER_CONNECTED, LOGOUT } from './common/events';

const url = 'http://localhost:5000';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      socket: null,
    };
  }

  componentDidMount() {
    this.initSocket();
  }

  // initialize connection
  initSocket = () => {
    const socket = io(url);
    socket.on('connect', () => {
    });
    this.setState({ socket });
  };

  addUserToList = user => {
    const { socket } = this.state;
    socket.emit(USER_CONNECTED, user, this.getLoggedInUsers);
    this.setState({ user });
  };

  

  handleSignOut = () => {
    const { socket } = this.state;
    socket.emit(LOGOUT);
    this.setState({ user: null });
  };

  render() {
    const { user, socket } = this.state;
    return (
      <div>
        {!user ? (
          <div className='account'>
            <SignIn addUser={this.addUserToList} socket={socket} />
          </div>
        ) : (
          <Layout
            user={user}
            socket={socket}
            handleSignOut={this.handleSignOut}
          />
        )}
      </div>
    );
  }
}
