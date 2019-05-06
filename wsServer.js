// const { logger } = require('logger');
const socketio = require('socket.io');
const cookieParser = require('cookie');
const Message = require('./models/message');
const User = require('./models/user');
const Session = require('models/session');
const Room = require('./models/room');
const getId = require('controllers/getId');

module.exports.init = async (server) => {
  const options = {};
  const io = socketio(server, options);
  
  io.origins(['http://localhost:3300']);

  io.on('connection', function(socket) {
    // logger.debug(`connect: ${socket.id}`);
    console.log(`connect: ${socket.id}`);

    socket.emit('connected', 'You are connected to chat!');
    
    socket.on('/chat/history/get', () => {
      // get room.id from route
      // get userId from session
      // get room.users[].dateConnected for userId
      // { cteatedAt: { $gte: roomUserDateConnected}} -- $gte is '<=' compare
      Message
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .exec((error, messages) => {
          if(!error) {
            messages.reverse();
            socket.emit('/chat/history/show', messages);
          }
        });
    });
    
    socket.on('/chat/message/send', async (content) => {
      console.log(`back: ${content}`);
      // get userId of curent socket
      const sidOfCurentSocket = getId.SessionIdFromSocket(socket);
      const session = await Session.findOne({ id: sidOfCurentSocket });
      const userId = session.userId;
      console.log(`get userId of curent socket --- ${userId}`);

      // const room = currentRoom;
      const room = await Room.findOne({ name: 'all' });
      // create message input from current socket
      const messageInput = new Message ({
        content: content,
        user: userId,
        room: room.id
      });
      // save messageInput
      const message = await messageInput.save();
      
      // emit message to all users from room.name
      // socket.emit('/chat/message/add', message);
      // socket.broadcast.emit('/chat/message/add', message);

      const usersFromRoom = room.users;
      const ioSockets = io.sockets.connected;
      // create array of all connected sockets
      let sockets = [];
      // console.log(ioSockets);
      for (let key in ioSockets) {
        sockets.push(ioSockets[key]);
      }
      // console.log(sockets[0].handshake);
      console.log('array of all connected sockets is created');

      sockets.forEach(async (socket) => {
        // get userId
        const sid = getId.SessionIdFromSocket(socket);
        console.log('*****');
        console.log(`wsServer ---  ${sid}`);
        const session = await Session.findOne({ id: sid });
        console.log(session);
        const userId = session.userId;
        console.log(userId);
        console.log('*****');

        if (room.users.indexOf(userId) !== -1) {
          io.to(socket).emit('/chat/message/add', message);
        };
        console.log('80 --- ')
        // console.log(socket.handshake);
      });
      console.log('------------------------');
      // console.log(`back: on('/chat/message/send')`);
    });
    
    socket.on('disconnect', (reason) => {
      // logger.debug(`disconnect: ${socket.id} ${reason}`);
      console.log(`disconnect: ${socket.id} ${reason}`);
    });
  });
};
