import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { GET_CONNECTED_USERS } from '../common/events';

export default class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      users: null,
      count: 0
    };
  }

  handleMessageToActiveChat = e => {
    e.preventDefault();
    const { message } = this.state;
    this.props.sendMessage(message);
    this.setState({ message: '' });
  };

  getLoggedInUsers = users => {
    this.setState({ users }, () => {
      this.sendMessage();
    });
  };

  handleSendMessage = e => {
    e.preventDefault();
    const { socket } = this.props;
    socket.emit(GET_CONNECTED_USERS, this.getLoggedInUsers);
  };

  sendMessage = () => {
    const { message, users, count } = this.state;
    const { user } = this.props;
    let activeUsers = Object.keys(users).filter(
      activeUser => activeUser !== user.username
    );
    activeUsers.splice(0, count);
    if (activeUsers.length === 0) {
      activeUsers = Object.keys(users).filter(
        activeUser => activeUser !== user.username
      );
    }
    const { onSendMessageToLoggedIn } = this.props;
    onSendMessageToLoggedIn(message, activeUsers[0]);
    this.setState({ message: '', count: this.state.count + 1 });
  };

  handleChange = ({ target }) => {
    this.setState({
      message: target.value
    });
  };

  render() {
    const { message } = this.state;

    const { activeChat } = this.props;
    return (
      <div>
        <Form
          onSubmit={
            activeChat ? this.handleMessageToActiveChat : this.handleSendMessage
          }
          className='form'
        >
          <Form.Control
            type='text'
            placeholder='Type something'
            name='message'
            value={message}
            onChange={this.handleChange}
          />
          <Button
            type='submit'
            disabled={message.length < 1}
            variant='outline-primary'
          >
            Send
          </Button>
        </Form>
      </div>
    );
  }
}
