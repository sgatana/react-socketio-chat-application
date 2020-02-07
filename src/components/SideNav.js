import React from 'react';
import { Form, InputGroup, ListGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

export default class SideNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reciever: ''
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { reciever } = this.state;
    this.props.onSendMessage(reciever);
  };

  render() {
    const { chats, setActiveChat, user } = this.props;
    const { reciever } = this.state;
    return (
      <div>
        <div className='title'>
          <p>Simple Chat Application</p>
        </div>
        <Form onSubmit={this.handleSubmit} noValidate>
          <Form.Group>
            <InputGroup>
              <Form.Control
                type='text'
                placeholder='Search user'
                aria-describedby='inputGroupPrepend'
                name='reciever'
                value={reciever}
                onChange={({ target }) => {
                  this.setState({ reciever: target.value });
                }}
              />
              <InputGroup.Append>
                <InputGroup.Text id='inputGroupPrepend'>
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </Form>

        <div>
          <p>Active users</p>
          <ListGroup as='ul' variant='flush'>
            {chats.map(chat => {
              if (chat.username) {
                const lastMessage = chat.messages[chat.messages.length - 1];
                const chatName =
                  chat.users.find(name => {
                    return name !== user.username;
                  }) || 'Public';
                const icon = chatName.charAt(0).toUpperCase();
                return (
                  <ListGroup.Item
                    as='li'
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                  >
                    <div>
                      <div className='user-list'>
                        <div className='icon'>{icon}</div>
                        <div>{chatName}</div>
                      </div>
                      <div>
                        {lastMessage && <span>{lastMessage.message}</span>}
                      </div>
                    </div>
                  </ListGroup.Item>
                );
              }
              return null;
            })}
          </ListGroup>
        </div>
      </div>
    );
  }
}
