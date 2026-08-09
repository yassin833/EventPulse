require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db.js');
const {errorHandler, AppError} = require('./middleware/errorHandler.js');
const userRoutes = require('./routes/userRoutes.js');
const PORT = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to our EventPulse website');
});

app.use('/api/users', userRoutes);

// 404 error-handler
app.use((req, res, next) => {
  return next(new AppError("Enpoint doesn't exist", 404));
});

// Central error-handler
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

startServer();