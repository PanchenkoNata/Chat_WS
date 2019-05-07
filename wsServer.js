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
    
    socket.on('/chat/history/get', async () => {
      // get room.id from route
      // get userId from session
      // get room.users[].dateConnected for userId
      const sidOfCurentSocket = getId.SessionIdFromSocket(socket);
      const session = await Session.findOne({ ID: sidOfCurentSocket });
      const sUserId = session.userId;

      // room has user with session.userId
      // const room = await Room.findOne({ name: 'all', users: { $elemMatch: { userId: sUserId } } });

      const room = await Room.findOne({ name: 'all' });
      let roomUserDateConnected;
      room.users.forEach((user) => {
        if(String(user.userId) === String(sUserId)) {
          roomUserDateConnected = user.dateConnected;
          return;
        }
      });
      // { cteatedAt: { $gte: roomUserDateConnected}} -- $gte is '<=' compare
      await Message
        .find({ createdAt: { $gte: roomUserDateConnected } })
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
      // get userId of curent socket
      const sidOfCurentSocket = getId.SessionIdFromSocket(socket);
      const session = await Session.findOne({ ID: sidOfCurentSocket });
      const sUserId = session.userId;
      const room = await Room.findOne({ name: 'all' });

      // create message input from current socket
      const messageInput = new Message ({
        content: content,
        user: sUserId,
        room: room.id
      });
      
      // save messageInput
      const message = await messageInput.save();
      const ioSockets = io.sockets.connected;
      for (let key in ioSockets) {
        socketReceiver = ioSockets[key];
        room.users.forEach((user) => {
          if( String(sUserId) === String(user.userId) ) {
            io.sockets.connected[socketReceiver.id].emit('/chat/message/add', message);
          };
        });
      };
    });
    
    socket.on('disconnect', (reason) => {
      // logger.debug(`disconnect: ${socket.id} ${reason}`);
      console.log(`disconnect: ${socket.id} ${reason}`);
    });
  });
};
