const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    minlength: [5, 'Description must be at least 5 characters'],
    maxlength: [100, 'Description CANNOT exceed 100 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date']
  },
  city: {
    type: String,
    required: [true, 'Please add a city'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Please specify event capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please assign a category']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);