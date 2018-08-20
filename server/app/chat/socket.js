const { ensureLoggedIn, ensureProjectCollaborator } = require('../../middleware/socket');
const { createMessage, findMessages } = require('./queries');

module.exports = io => {

  // auth middleware to prevent unauthorized users from entering chat
  io.use(ensureLoggedIn);
  io.use(ensureProjectCollaborator);

  io.sockets.on('connection', socket => {
    socket.on('subscribe', ({ room, token }) => {

      io.to(room).emit('subscribe_successful');

      socket.on('load_initial_messages', async () => {
        try {

          let messages = await findMessages(room);
          io.to(room).emit('load_initial_messages_success', messages);

        } catch (err) {

          io.to(room).emit('load_initial_messages_fail', err.message);
          return null;

        }
        
      });

      socket.on('send_message', async message => {
        try {

          let newMessage = await createMessage(message, room, socket.request.user.id)
          io.to(room).emit('send_message_success', newMessage);

        } catch (err) {

          io.to(room).emit('send_message_fail', err.message);
          return null;

        }
      });

    });
  });
}