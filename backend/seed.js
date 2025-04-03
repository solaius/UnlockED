const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load models
const User = require('./models/User');
const Module = require('./models/Module');
const Question = require('./models/Question');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unlocked')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Read content files
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
};

// Seed database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Module.deleteMany({});
    await Question.deleteMany({});
    
    console.log('Database cleared');
    
    // Create sample users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const users = [
      {
        username: 'student1',
        email: 'student1@example.com',
        password: hashedPassword,
        role: 'student'
      },
      {
        username: 'teacher1',
        email: 'teacher1@example.com',
        password: hashedPassword,
        role: 'teacher'
      }
    ];
    
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    
    // Create modules
    const modulesPath = path.join(__dirname, '..', 'content-system', 'lessons');
    const moduleFiles = fs.readdirSync(modulesPath).filter(file => file.endsWith('.json'));
    
    const modulePromises = moduleFiles.map(async (file) => {
      const moduleData = readJsonFile(path.join(modulesPath, file));
      if (moduleData) {
        const module = new Module({
          title: moduleData.title,
          description: moduleData.description,
          level: moduleData.level,
          content: moduleData.content,
          objectives: moduleData.objectives,
          prerequisites: []
        });
        
        return module.save();
      }
    });
    
    const modules = await Promise.all(modulePromises);
    console.log(`${modules.length} modules created`);
    
    // Create questions
    const questionsPath = path.join(__dirname, '..', 'content-system', 'questions');
    const questionFiles = fs.readdirSync(questionsPath).filter(file => file.endsWith('.json'));
    
    for (const file of questionFiles) {
      const questionsData = readJsonFile(path.join(questionsPath, file));
      
      if (questionsData && Array.isArray(questionsData)) {
        // Find the module for these questions
        const moduleId = file.split('_')[0]; // Assuming filename format: moduleX_questions.json
        const module = modules.find(m => m.title.toLowerCase().includes(moduleId));
        
        if (module) {
          const questionPromises = questionsData.map(async (questionData) => {
            const question = new Question({
              text: questionData.text,
              type: questionData.type,
              difficulty: questionData.difficulty,
              options: questionData.options || [],
              correctAnswer: questionData.correctAnswer || '',
              explanation: questionData.explanation,
              hints: questionData.hints || [],
              points: questionData.points,
              module: module._id
            });
            
            const savedQuestion = await question.save();
            
            // Add question to module
            module.questions.push(savedQuestion._id);
            
            return savedQuestion;
          });
          
          const questions = await Promise.all(questionPromises);
          console.log(`${questions.length} questions created for module ${module.title}`);
          
          // Save updated module with questions
          await module.save();
        }
      }
    }
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();