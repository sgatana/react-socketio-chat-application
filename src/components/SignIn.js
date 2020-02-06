import React, { Component } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { getUser } from '../server/factories';
import { VERIFY_USER } from '../common/events';

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: ''
    };
  }
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  verifyUser = ({ user, isUser }) => {
    if (isUser) {
      this.setState({ error: 'user has already logged in' });
    } else {
      this.setState({ error: '' });
      this.props.addUser(user);
    }
  };

  clearForm = () => {
    this.setState({
      username: '',
      password: ''
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state;
    const { socket } = this.props;
    const user = getUser(username, password);
    if (!user) {
      this.setState({ error: 'Please log in with a valid username/password' });
    } else {
      socket.emit(VERIFY_USER, user.username, this.verifyUser);
      this.clearForm();
    }
  };
  render() {
    const { username, password, error } = this.state;
    return (
      <div className='login'>
        <h5>User Login</h5>
        <Form onSubmit={this.handleSubmit} noValidate>
          <Form.Group>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id='inputGroupPrepend'>
                  <FaUserAlt />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type='text'
                placeholder='Username'
                aria-describedby='inputGroupPrepend'
                name='username'
                value={username}
                onChange={this.handleChange}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id='inputGroupPrepend'>
                  <FaLock />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type='password'
                placeholder='Password'
                aria-describedby='inputGroupPrepend'
                name='password'
                value={password}
                onChange={this.handleChange}
              />
            </InputGroup>
            <div className='error'>{error ? <p>{error}</p> : null}</div>
          </Form.Group>
          <div className='button'>
            <Button type='submit' variant='outline-primary'>
              Login
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}
