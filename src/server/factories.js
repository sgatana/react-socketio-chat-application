const uuid = require('uuid');
const moment = require('moment');
const { users } = require('./models/users');

// get user
const getUser = (username, password) => {
  return users.find(
    user => user.username === username && user.password === password
  );
};

// format time
const getTime = date => {
  return moment(date).format('HH:mm');
};

// create message

const createMessage = ({ message, sender }) => {
  return {
    id: uuid(),
    time: getTime(new Date()),
    message,
    sender
  };
};

// create chat, create a public chat /channel
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
