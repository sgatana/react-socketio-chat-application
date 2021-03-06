import React, { Component } from 'react';
import Header from './Header';
import SideNav from './SideNav';
import {
  MESSAGE_SENT,
  PUBLIC_CHAT,
  SEND_TO_USER,
  MESSAGE_RECIEVED,
  PRIVATE_MESSAGE
} from '../common/events';
import Messages from './Messages';
import MessageInput from './MessageInput';

export default class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      activeChat: null
    };
  }

  setActiveChat = activeChat => {
    this.setState({ activeChat });
  };

  sendMessage = (chatId, message) => {
    const { socket } = this.props;
    socket.emit(MESSAGE_SENT, { chatId, message });
  };

  componentDidMount() {
    const { socket } = this.props;
    socket.emit(PUBLIC_CHAT, this.resetChat);
    socket.on(PRIVATE_MESSAGE, this.addChat);
    socket.on('connect', () => {
      socket.emit(PUBLIC_CHAT, this.resetChat);
    });
  }

  sendMessageToUser = reciever => {
    const { socket, user } = this.props;
    socket.emit(PRIVATE_MESSAGE, { reciever, sender: user.username });
  };

  sendMessageToLoggedIn = (message, reciever) => {
    const { socket, user } = this.props;
    socket.emit(
      SEND_TO_USER,
      { sender: user.username, reciever, message },
      this.sendMessage
    );
  };

  resetChat = chat => {
    return this.addChat(chat, true);
  };

  addChat = (chat, reset = false) => {
    const { socket } = this.props;
    const { chats } = this.state;
    const newChats = reset ? [chat] : [...chats, chat];

    this.setState({ chats: newChats });
    const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`;
    socket.on(messageEvent, this.addMessageToChat(chat.id));
  };

  addMessageToChat = chatId => {
    return message => {
      const { chats } = this.state;

      let newChats = chats.map(chat => {
        if (chat.id === chatId) {
          chat.messages.push(message);
        }
        return chat;
      });
      this.setState({ chats: newChats });
    };
  };

  render() {
    const { user, handleSignOut, socket } = this.props;
    const { chats, activeChat } = this.state;
    return (
      <div className='main'>
        <div className='sidebar'>
          <SideNav
            user={user}
            chats={chats}
            activeChat={activeChat}
            setActiveChat={this.setActiveChat}
            onSendMessage={this.sendMessageToUser}
            onSendMessageToLoggedIn={this.sendMessageToLoggedIn}
          />
        </div>
        <div className='content'>
          <Header onSignOut={handleSignOut} user={user} />
          <div className='chat-container'>
            <div ref='content' className='thread-container'>
              {activeChat && (
                <Messages messages={activeChat.messages} user={user} />
              )}
            </div>
            <MessageInput
              user={user}
              socket={socket}
              activeChat={activeChat}
              sendMessage={message =>
                this.sendMessage(activeChat.id, message)

              }
              onSendMessageToLoggedIn={this.sendMessageToLoggedIn}
            />
          </div>
        </div>
      </div>
    );
  }
}
