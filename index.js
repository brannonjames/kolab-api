const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3060;

const userRoutes = require('./app/users/routes');
const errorRoute = require('./modules/error');

app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use(errorRoute);


// Run server
const server = app.listen(PORT, () => {
  console.log('KoLab server running on port ', PORT);
});