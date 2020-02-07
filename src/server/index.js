const http = require('http');
const socketio = require('socket.io');
const {
  USER_CONNECTED,
  VERIFY_USER,
  LOGOUT,
  USER_DISCONNECTED,
  PUBLIC_CHAT,
  MESSAGE_RECIEVED,
  MESSAGE_SENT,
  PRIVATE_MESSAGE,
  SEND_TO_USER,
  GET_CONNECTED_USERS
} = require('../common/events');
const { createChat, createMessage, createUserSession } = require('./factories');

const app = http.createServer();
const port = process.env.PORT || 5000;
const io = socketio(app);

let loggedInUsers = {};
let sentMessages = [];
let publicChat = createChat();

io.on('connection', socket => {
  let sendMessageToChatFromUser;
  socket.on(VERIFY_USER, (username, cb) => {
    if (isUserLoggedIn(loggedInUsers, username)) {
      cb({ isUser: true, user: null });
    } else {
      cb({
        isUser: false,
        user: createUserSession({ username, socketId: socket.id })
      });
    }
  });

  socket.on(USER_CONNECTED, user => {
    user.socketId = socket.id;
    loggedInUsers = addUserToList(loggedInUsers, user);
    socket.user = user;
    sendMessageToChatFromUser = sendMessageToChat(user.username);
  });

  socket.on('disconnect', () => {
    if ('user' in socket) {
      loggedInUsers = removeUser(loggedInUsers, socket.user.username);
      io.emit(USER_DISCONNECTED, loggedInUsers);
    }
  });

  socket.on(LOGOUT, () => {
    loggedInUsers = removeUser(loggedInUsers, socket.user.username);
    io.emit(USER_DISCONNECTED, loggedInUsers);
  });

  socket.on(PUBLIC_CHAT, cb => {
    cb(publicChat);
  });

  socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    sendMessageToChatFromUser(chatId, message);
  });

  socket.on(PRIVATE_MESSAGE, ({ reciever, sender }) => {
    if (reciever in loggedInUsers) {
      const newChat = createChat({
        name: `${reciever}&${sender}`,
        users: [reciever, sender]
      });
      const recieverSocket = loggedInUsers[reciever].socketId;

      socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat);
      socket.emit(PRIVATE_MESSAGE, newChat);
    }
  });

  socket.on(SEND_TO_USER, ({ sender, reciever, message }, cb) => {
    const newChat = createChat({
      name: `${reciever}&${sender}`,
      users: [reciever, sender]
    });
    cb(newChat.id, message);
    const recieverSocket = loggedInUsers[reciever].socketId;
    socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat);
    socket.emit(PRIVATE_MESSAGE, newChat);
    sentMessages.push(reciever);
  });

  socket.on(GET_CONNECTED_USERS, cb => {
    cb(loggedInUsers);
  });
});

function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(
      `${MESSAGE_RECIEVED}-${chatId}`,
      createMessage({ message, sender })
    );
  };
}

function addUserToList(userList, user) {
  const newList = Object.assign({}, userList);
  newList[user.username] = user;
  return newList;
}

function isUserLoggedIn(userList, username) {
  return username in userList;
}

function removeUser(userList, username) {
  const newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
}
app.listen(port, () => {
  console.log(`socket running on port ${port}`);
});
