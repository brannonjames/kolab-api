const io = require('socket.io')();
const { ensureLoggedIn, ensureProjectCollaborator } = require('./middleware');

io.use(ensureLoggedIn);
io.use(ensureProjectCollaborator);

const MESSAGES = [
  { text: 'Hello first message', user: 'Jimmy', id: 0 },
  { text: 'Hello second message', user: 'Jimmy', id: 1 },
  { text: 'Hello third message', user: 'Jimmy', id: 2 }
]

let CURRENT_ID = 3;

class Message {
  constructor(text){
    this.text = text;
    this.user = 'Jimmy',
    this.id = CURRENT_ID + 1
  }
}

module.exports = server => {
  io.listen(server);


  io.on('connection', socket => {
    socket.on('subscribe', async ({ room, token }) => {
      try {

        io.to(room).emit('subscribe_successful');

        socket.on('load_initial_messages', () => {
          io.to(room).emit('load_initial_messages_success', MESSAGES);
        });

        socket.on('send_message', message => {

          let newMessage = new Message(message);
          console.log(newMessage)
          MESSAGES.push(newMessage);

          CURRENT_ID++

          io.to(room).emit('send_message_success', newMessage);
        });

      } catch (err) {
        console.log(err);
        io.to(room).emit('error', err.message);

      }
    })
  })
}