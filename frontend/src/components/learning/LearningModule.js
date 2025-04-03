import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import QuestionCard from './QuestionCard';

const LearningModule = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  
  const [module, setModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  
  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        // Fetch module details
        const moduleRes = await axios.get(
          `http://localhost:5000/api/modules/${moduleId}`,
          config
        );
        
        if (moduleRes.data.success) {
          setModule(moduleRes.data.data);
        }
        
        // Fetch questions for this module
        const questionsRes = await axios.get(
          `http://localhost:5000/api/questions/module/${moduleId}`,
          config
        );
        
        if (questionsRes.data.success) {
          setQuestions(questionsRes.data.data);
        }
        
        // Fetch user's progress for this module
        const progressRes = await axios.get(
          `http://localhost:5000/api/progress/module/${moduleId}`,
          config
        );
        
        if (progressRes.data.success) {
          setUserProgress(progressRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching module data:', err);
        setError('Failed to load module. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModuleData();
  }, [moduleId]);
  
  const handleAnswerSubmit = async (questionId, answer) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      // First, evaluate the answer using the AI module
      const aiRes = await axios.post(
        'http://localhost:5001/api/evaluate',
        {
          question: questions[currentQuestionIndex],
          answer
        }
      );
      
      // Then, submit the answer to update progress
      const progressRes = await axios.post(
        'http://localhost:5000/api/progress/answer',
        {
          moduleId,
          questionId,
          answer
        },
        config
      );
      
      if (progressRes.data.success) {
        // Set feedback from AI evaluation
        setFeedback({
          isCorrect: progressRes.data.isCorrect,
          message: aiRes.data.feedback,
          explanation: aiRes.data.explanation,
          pointsEarned: progressRes.data.pointsEarned
        });
        
        // Update user progress
        setUserProgress({
          ...userProgress,
          score: progressRes.data.progress.score,
          completed: progressRes.data.progress.completed
        });
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to submit answer. Please try again.');
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback(null);
    } else if (userProgress.completed) {
      // If all questions are answered and module is completed
      navigate('/dashboard');
    }
  };
  
  if (loading) {
    return <div className="container text-center mt-5">Loading module...</div>;
  }
  
  if (error) {
    return <div className="alert-error">{error}</div>;
  }
  
  if (!module || questions.length === 0) {
    return (
      <div className="container text-center mt-5">
        <p>No content available for this module yet.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn-primary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="learning-module-container">
      <div className="module-header">
        <h1>{module.title}</h1>
        <div className="progress-indicator">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="module-content">
        <div className="content-section">
          <h2>Lesson Content</h2>
          <div className="lesson-text">
            {module.content}
          </div>
          
          <div className="objectives-list">
            <h3>Learning Objectives:</h3>
            <ul>
              {module.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="question-section">
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              onSubmit={handleAnswerSubmit}
              feedback={feedback}
              onNext={handleNextQuestion}
            />
          )}
        </div>
      </div>
      
      <div className="gamification-panel">
        <div className="points-display">
          <span className="points-label">Points:</span>
          <span className="points-value">{userProgress?.score || 0}</span>
        </div>
        
        {userProgress?.completed && (
          <div className="completion-message">
            <span>Module Completed! 🎉</span>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningModule;