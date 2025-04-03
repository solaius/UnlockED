const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Module = require('../models/Module');
const auth = require('../middleware/auth');

// @route   GET /api/questions
// @desc    Get all questions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.find();
    res.json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/questions/:id
// @desc    Get single question
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json({ success: true, data: question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/questions/module/:moduleId
// @desc    Get questions for a specific module
// @access  Private
router.get('/module/:moduleId', auth, async (req, res) => {
  try {
    const questions = await Question.find({ module: req.params.moduleId });
    res.json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/questions
// @desc    Create a question
// @access  Private (Teacher only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized to create questions' });
    }
    
    // Check if module exists
    const module = await Module.findById(req.body.module);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    const question = await Question.create(req.body);
    
    // Add question to module
    module.questions.push(question._id);
    await module.save();
    
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Private (Teacher only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized to update questions' });
    }
    
    let question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({ success: true, data: question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/questions/:id
// @desc    Delete a question
// @access  Private (Teacher only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized to delete questions' });
    }
    
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Remove question from module
    const module = await Module.findById(question.module);
    if (module) {
      module.questions = module.questions.filter(
        q => q.toString() !== req.params.id
      );
      await module.save();
    }
    
    await question.remove();
    
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;