require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3060;

const userRoutes = require('./app/users/routes');
const projectRoutes = require('./app/projects/routes');
const { handleAuth } = require('./app/middleware/auth');
const FOFRoute = require('./modules/FOFRoute');
const errorRoute = require('./modules/error');

// middleware
app.use(bodyParser.json());

// my own middleware for handling auth requests
app.use(handleAuth);

// my defined routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// route to handle any 404s
app.use(FOFRoute);

// error route to handle all application errors
app.use(errorRoute);


// Run server
const server = app.listen(PORT, () => {
  console.log('KoLab server running on port ', PORT);
});