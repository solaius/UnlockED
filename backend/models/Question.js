const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide the question text'],
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'fill-in-blank'],
    required: [true, 'Please specify the question type']
  },
  difficulty: {
    type: Number,
    required: [true, 'Please specify the difficulty level'],
    min: 1,
    max: 5
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: String
  },
  explanation: {
    type: String,
    required: [true, 'Please provide an explanation for the answer']
  },
  hints: [{
    type: String
  }],
  points: {
    type: Number,
    default: 10
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', QuestionSchema);