const mongoose = require('mongoose');

const connectDB = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('Connection successful');
  } catch(err) {
    console.error('Connection failed');
    process.exit(1);
  }
}

module.exports = connectDB;