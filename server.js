require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db.js');
const PORT = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to our EventPulse website');
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

startServer();