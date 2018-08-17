const io = require('socket.io')();
const { ensureLoggedIn, ensureProjectCollaborator } = require('./middleware');
const { createMessage, findMessages } = require('../../app/chat/queries');

io.use(ensureLoggedIn);
io.use(ensureProjectCollaborator);

module.exports = server => {
  io.listen(server);


  io.on('connection', socket => {
    socket.on('subscribe', ({ room, token }) => {
      try {

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
        console.log(err);
        io.to(room).emit('error', err.message);

      }
    })
  })
}