
## Description
 - A simple chat application built with react and socker.io.
 - implements sending messages to all logged in users using round-robing technique.
  - sending private messages.
  - sending messages to public channel.

## Installation
- Clone the repo `git remote add origin https://github.com/sgatana/react-socketio-chat-application.git`
- cd to project
- run `yarn` or `npm install` to install packages
- run `yarn start:dev` to start both the client and server. *NB server starts on port 5000*
- Alternatively, you can `yarn start` to start the client and `yarn server` to start the server.
- Checkout mock data of users (`src/server/models/users`) to log in 