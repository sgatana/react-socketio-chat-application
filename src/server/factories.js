const uuid = require('uuid');
const moment = require('moment');
const { users } = require('./models/users');

// get user
const getUser = (username, password) => {
  return users.find(
    user => user.username === username && user.password === password
  );
};

// create message

const createMessage = ({ message, sender }) => {
  return {
    id: uuid(),
    time: getTime(new Date(Date.now())),
    message,
    sender
  };
};

// create chat
const createChat = ({
  messages = [],
  username = 'Public',
  users = []
} = {}) => {
  return {
    id: uuid(),
    username,
    messages,
    users
  };
};

// format time
const getTime = date => {
  return moment(date).format('HH:mm');
};

const createUserSession = ({ username = '', socketId = null } = {}) => {
  return {
    id: uuid(),
    username,
    socketId
  };
};

module.exports = {
  createChat,
  createMessage,
  getUser,
  createUserSession
};
