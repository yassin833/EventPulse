const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    minlength: [5, 'Description must be at least 5 characters'],
    maxlength: [100, 'Description CANNOT exceed 100 characters']
  }
}, {timestamps: true});

module.exports = mongoose.model('Category', categorySchema);