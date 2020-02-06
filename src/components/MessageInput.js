import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

export default class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { message } = this.state;
    this.props.sendMessage(message);
    this.setState({ message: '' });
  };

  handleChange = ({ target }) => {
    this.setState({
      message: target.value
    });
  };

  render() {
    const { message } = this.state;

    return (
      <div >
        <Form onSubmit={this.handleSubmit} className='form'>
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
