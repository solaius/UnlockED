const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a module title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a module description']
  },
  level: {
    type: Number,
    required: [true, 'Please specify the module level'],
    min: 1
  },
  content: {
    type: String,
    required: [true, 'Please provide module content']
  },
  objectives: [{
    type: String
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Module', ModuleSchema);