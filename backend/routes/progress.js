const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const User = require('../models/User');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

// @route   GET /api/progress
// @desc    Get user's progress
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate('module', 'title level')
      .populate('questionsAnswered.question', 'text type');
    
    res.json({ success: true, count: progress.length, data: progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/progress/module/:moduleId
// @desc    Get user's progress for a specific module
// @access  Private
router.get('/module/:moduleId', auth, async (req, res) => {
  try {
    let progress = await Progress.findOne({
      user: req.user.id,
      module: req.params.moduleId
    })
      .populate('module', 'title level')
      .populate('questionsAnswered.question', 'text type');
    
    // If no progress record exists, create one
    if (!progress) {
      progress = await Progress.create({
        user: req.user.id,
        module: req.params.moduleId
      });
      
      progress = await Progress.findById(progress._id)
        .populate('module', 'title level');
    }
    
    res.json({ success: true, data: progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/progress/answer
// @desc    Submit an answer to a question
// @access  Private
router.post('/answer', auth, async (req, res) => {
  try {
    const { moduleId, questionId, answer } = req.body;
    
    if (!moduleId || !questionId || !answer) {
      return res.status(400).json({ message: 'Please provide moduleId, questionId, and answer' });
    }
    
    // Find the question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if the answer is correct
    let isCorrect = false;
    if (question.type === 'multiple-choice') {
      const correctOption = question.options.find(option => option.isCorrect);
      isCorrect = answer === correctOption.text;
    } else if (question.type === 'fill-in-blank') {
      isCorrect = answer.toLowerCase() === question.correctAnswer.toLowerCase();
    }
    
    // Calculate points earned
    const pointsEarned = isCorrect ? question.points : 0;
    
    // Find or create progress record
    let progress = await Progress.findOne({
      user: req.user.id,
      module: moduleId
    });
    
    if (!progress) {
      progress = await Progress.create({
        user: req.user.id,
        module: moduleId
      });
    }
    
    // Check if question has been answered before
    const existingAnswerIndex = progress.questionsAnswered.findIndex(
      qa => qa.question.toString() === questionId
    );
    
    if (existingAnswerIndex !== -1) {
      // Update existing answer
      progress.questionsAnswered[existingAnswerIndex].userAnswer = answer;
      progress.questionsAnswered[existingAnswerIndex].isCorrect = isCorrect;
      progress.questionsAnswered[existingAnswerIndex].attempts += 1;
      
      // Only update points if the answer is now correct and wasn't before
      if (isCorrect && !progress.questionsAnswered[existingAnswerIndex].isCorrect) {
        progress.questionsAnswered[existingAnswerIndex].pointsEarned = pointsEarned;
        progress.score += pointsEarned;
        
        // Update user's points
        await User.findByIdAndUpdate(req.user.id, {
          $inc: { 'progress.points': pointsEarned }
        });
      }
      
      progress.questionsAnswered[existingAnswerIndex].timestamp = Date.now();
    } else {
      // Add new answer
      progress.questionsAnswered.push({
        question: questionId,
        userAnswer: answer,
        isCorrect,
        attempts: 1,
        pointsEarned,
        timestamp: Date.now()
      });
      
      // Update score
      progress.score += pointsEarned;
      
      // Update user's points
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'progress.points': pointsEarned }
      });
    }
    
    // Update last accessed
    progress.lastAccessed = Date.now();
    
    // Check if module is completed
    const moduleQuestions = await Question.find({ module: moduleId });
    const answeredCorrectly = progress.questionsAnswered.filter(qa => qa.isCorrect).length;
    
    if (answeredCorrectly === moduleQuestions.length) {
      progress.completed = true;
      
      // Update user's completed lessons
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { 'progress.completedLessons': moduleId }
      });
      
      // Check if user should level up
      const user = await User.findById(req.user.id);
      const completedModules = await Progress.find({
        user: req.user.id,
        completed: true
      }).populate('module', 'level');
      
      const highestCompletedLevel = Math.max(
        ...completedModules.map(p => p.module.level),
        0
      );
      
      if (highestCompletedLevel >= user.progress.currentLevel) {
        await User.findByIdAndUpdate(req.user.id, {
          'progress.currentLevel': highestCompletedLevel + 1
        });
      }
    }
    
    await progress.save();
    
    // Get updated user data
    const updatedUser = await User.findById(req.user.id);
    
    res.json({
      success: true,
      isCorrect,
      pointsEarned,
      explanation: question.explanation,
      progress: {
        score: progress.score,
        completed: progress.completed
      },
      user: {
        points: updatedUser.progress.points,
        level: updatedUser.progress.currentLevel
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/progress/students
// @desc    Get progress for all students (teacher only)
// @access  Private (Teacher only)
router.get('/students', auth, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized to access student progress' });
    }
    
    // Get all students
    const students = await User.find({ role: 'student' }).select('-password');
    
    // Get progress for each student
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const progress = await Progress.find({ user: student._id })
          .populate('module', 'title level')
          .select('completed score lastAccessed');
        
        return {
          id: student._id,
          username: student.username,
          email: student.email,
          points: student.progress.points,
          level: student.progress.currentLevel,
          progress
        };
      })
    );
    
    res.json({ success: true, count: studentsWithProgress.length, data: studentsWithProgress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;