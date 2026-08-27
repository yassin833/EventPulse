const mongoose = require('mongoose');

async function connectTestDB() {
  const URI = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  await mongoose.connect(URI);
}

async function disconnectTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
}

module.exports = {connectTestDB, disconnectTestDB};