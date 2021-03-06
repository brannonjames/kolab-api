require('dotenv').config()
const app = require('express')();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3060;
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);


const userRoutes = require('./app/users/routes');
const projectRoutes = require('./app/projects/routes');
const { handleAuth } = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const error = require('./middleware/error');

const initializeSocketIo = require('./app/chat/socket');

// middleware
app.use(bodyParser.json());

// my own middleware module for handling auth requests
app.use(handleAuth);

// my defined routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// route to handle any 404s
app.use(notFound);

// error route to handle all application errors
app.use(error);


// Run server
server.listen(PORT, () => console.log('server running on', PORT));

initializeSocketIo(io);