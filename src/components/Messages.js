import React, { Component } from 'react';

export default class Messages extends Component {
  render() {
    const { messages, user } = this.props;
    return (
      <div className='thread-container'>
        <div className='thread'>
          {messages.map(message => {
            return (
              <div
                key={message.id}
                className={`message-container ${message.sender === user.username &&
                  'right'}`}
              >
                <div className='time'>{message.time}</div>
                <div className='data'>
                  <div className='message'>{message.message}</div>
                  <div className='name'>{message.sender}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
