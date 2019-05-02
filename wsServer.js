// const { logger } = require('logger');
const socketio = require('socket.io');
const Message = require('./models/message');

module.exports.init = async (server) => {
  const options = {};
  const io = socketio(server, options);
  
  io.origins(['http://localhost:3300']);

  io.on('connection', (socket) => {
    // logger.debug(`connect: ${socket.id}`);
    console.log(`connect: ${socket.id}`);
    socket.emit('connected', 'You are connected to chat!');

    socket.join('all');
    
    socket.on('/chat/history/get', () => {
      Message
        .find({})
        .sort({ createdAt: -1 })
        .limit(20)
        .sort({ createdAt: 1 })
        .lean()
        .exec((error, messages) => {
          if(!error) {
            socket.emit('/chat/history/show', messages);
            socket.to('all').emit('/chat/history/show', messages);
          }
        });
    });
    
    socket.on('/chat/message/send', async (content) => {
      console.log(`back: ${content}`);
      const user = socket.id;

      const messageIn = new Message ({
        content: content,
        user: user,
      });

      const message = await messageIn.save();
      
      socket.emit('/chat/message/add', message);
      socket.to('all').emit('/chat/message/add', message);
      console.log(`back: on('/chat/message/send')`);
      // } catch (error) {
      //   console.error(`socket.on('/chat/message/send') ${error}`);
      // }
      
    });
    
    socket.on('disconnect', (reason) => {
      // logger.debug(`disconnect: ${socket.id} ${reason}`);
      console.log(`disconnect: ${socket.id} ${reason}`);
    });
  });
}
