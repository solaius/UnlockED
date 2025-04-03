const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const auth = require('../middleware/auth');

// @route   POST /api/ai/evaluate
// @desc    Evaluate a student's answer using rule-based AI
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    
    if (!questionId || !answer) {
      return res.status(400).json({ message: 'Please provide questionId and answer' });
    }
    
    // Find the question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Evaluate the answer
    let isCorrect = false;
    let feedback = '';
    
    if (question.type === 'multiple-choice') {
      const correctOption = question.options.find(option => option.isCorrect);
      isCorrect = answer === correctOption.text;
      
      if (isCorrect) {
        feedback = 'Correct! ' + question.explanation;
      } else {
        // Find which option they selected
        const selectedOption = question.options.find(option => option.text === answer);
        
        if (selectedOption) {
          // Provide specific feedback based on common misconceptions
          feedback = 'Not quite. ' + question.explanation;
        } else {
          feedback = 'Please select one of the provided options.';
        }
      }
    } else if (question.type === 'fill-in-blank') {
      // Case-insensitive comparison
      isCorrect = answer.toLowerCase() === question.correctAnswer.toLowerCase();
      
      if (isCorrect) {
        feedback = 'Correct! ' + question.explanation;
      } else {
        // Check for common errors in chemistry nomenclature
        const userAnswer = answer.toLowerCase();
        const correctAnswer = question.correctAnswer.toLowerCase();
        
        // Check for missing charge indicators
        if (correctAnswer.includes('(') && !userAnswer.includes('(')) {
          feedback = 'Remember to include the charge in your answer. For example, Fe(III) indicates iron with a 3+ charge.';
        }
        // Check for incorrect prefixes (mono, di, tri, etc.)
        else if (
          (correctAnswer.includes('mono') && !userAnswer.includes('mono')) ||
          (correctAnswer.includes('di') && !userAnswer.includes('di')) ||
          (correctAnswer.includes('tri') && !userAnswer.includes('tri'))
        ) {
          feedback = 'Check your prefixes. Remember to use "mono-" for one, "di-" for two, "tri-" for three, etc.';
        }
        // Check for acid naming errors
        else if (correctAnswer.includes('acid') && userAnswer.includes('acid')) {
          feedback = 'Your answer includes "acid" but there may be an error in the naming convention. Remember the rules for naming acids.';
        }
        // Default feedback
        else {
          feedback = 'Not quite. ' + question.explanation;
        }
      }
    }
    
    // Return evaluation results
    res.json({
      success: true,
      isCorrect,
      feedback,
      correctAnswer: isCorrect ? null : question.correctAnswer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;