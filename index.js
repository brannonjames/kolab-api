const express = require('express');
const app = express();

const PORT = process.env.PORT || 3060;


// Run server
const server = app.listen(PORT, () => {
  console.log('KoLab server running on port ', PORT);
});