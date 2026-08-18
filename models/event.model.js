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
  venue: {
    type: String,
    required: [true, 'Please add a venue'], 
    trim: true 
  },
  capacity: {
    type: Number,
    required: [true, 'Please specify event capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "The creator's name is required"]
  }
}, {timestamps: true});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;