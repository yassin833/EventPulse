const mongoose = require('mongoose');

// This is for the serverless nature of Vercel 
let cached = global.mongooseConnection;
if (!cached) {
  cached = global.mongooseConnection = {conn: null, promise: null};
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGO_URI); 
    }
    cached.conn = await cached.promise;
    console.log('Connection successful');
    return cached.conn;
  } catch(err) {
    // If an error comes, allow for a retry instead of caching a permanent failure
    // instead of process exiting, we throw the error and let app.js decide what to do
    console.error('Connection failed', err);
    cached.promise = null;
    throw err;
  }
}

module.exports = connectDB;