const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3060;

const userRoutes = require('./app/users/routes');

app.use(bodyParser.json());

app.use('/api/user', userRoutes);


// Run server
const server = app.listen(PORT, () => {
  console.log('KoLab server running on port ', PORT);
});