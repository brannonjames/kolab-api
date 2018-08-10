require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3060;

const userRoutes = require('./app/users/routes');
const errorRoute = require('./modules/error');

// middleware
app.use(bodyParser.json());

// my defined routes
app.use('/api/user', userRoutes);

// error route to handle all application errors
app.use(errorRoute);


// Run server
const server = app.listen(PORT, () => {
  console.log('KoLab server running on port ', PORT);
});