const express = require('express');
const router = express.Router();
const Module = require('../models/Module');
const auth = require('../middleware/auth');

// @route   GET /api/modules
// @desc    Get all modules
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const modules = await Module.find().sort({ level: 1 });
    res.json({ success: true, count: modules.length, data: modules });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/modules/:id
// @desc    Get single module
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate('questions');
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    res.json({ success: true, data: module });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/modules
// @desc    Create a module
// @access  Private (Teacher only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized to create modules' });
    }
    
    const module = await Module.create(req.body);
    res.status(201).json({ success: true, data: module });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/modules/:id
// @desc    Update a module
// @access  Private (Teacher only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized to update modules' });
    }
    
    let module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    module = await Module.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({ success: true, data: module });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/modules/:id
// @desc    Delete a module
// @access  Private (Teacher only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized to delete modules' });
    }
    
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    await module.remove();
    
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;