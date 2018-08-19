const io = require('socket.io')();
const { ensureLoggedIn, ensureProjectCollaborator } = require('./middleware');
const { createMessage, findMessages } = require('../../app/chat/queries');

io.use(ensureLoggedIn);
io.use(ensureProjectCollaborator);

module.exports = io => {

  io.on('connection', socket => {
    console.log('connection')
    socket.on('subscribe', ({ room, token }) => {
      try {

        console.log('subscribe');

        io.to(room).emit('subscribe_successful');

        socket.on('load_initial_messages', async () => {

          let messages = await findMessages(room);

          io.to(room).emit('load_initial_messages_success', messages);
        });

        socket.on('send_message', async message => {

          let newMessage = await createMessage(message, room, socket.request.user.id)
          io.to(room).emit('send_message_success', newMessage);
        });

      } catch (err) {
        
        io.to(room).emit('error', err.message);

      }
    })
  })
}