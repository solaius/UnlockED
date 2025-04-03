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
        // Demo data for modules
        const demoModules = {
          'module1': {
            _id: 'module1',
            title: 'Introduction to Chemical Nomenclature',
            description: 'Learn the basics of naming chemical compounds and understanding chemical formulas.',
            level: 1,
            content: 'Chemical nomenclature is the system of naming chemical compounds. The rules for naming compounds are based on the type of compound and its chemical structure.\n\nIn this module, we\'ll focus on naming simple binary compounds - those composed of just two elements. These include:\n\n1. Binary ionic compounds (metal + non-metal)\n2. Binary molecular compounds (non-metal + non-metal)\n\nFor binary ionic compounds, we name the metal first (keeping its name unchanged), followed by the non-metal with its ending changed to \'-ide\'.\n\nExamples:\n- NaCl: sodium chloride\n- MgO: magnesium oxide\n- CaF2: calcium fluoride\n\nFor transition metals that can form multiple ions with different charges, we specify the charge using Roman numerals in parentheses.\n\nExamples:\n- FeCl2: iron(II) chloride\n- FeCl3: iron(III) chloride',
            objectives: [
              'Identify the difference between ionic and molecular compounds',
              'Name binary ionic compounds correctly',
              'Understand how to indicate charges for transition metals',
              'Recognize common chemical formulas and their names'
            ]
          },
          'module2': {
            _id: 'module2',
            title: 'Naming Binary Molecular Compounds',
            description: 'Learn how to name compounds formed between two non-metals.',
            level: 2,
            content: 'Binary molecular compounds are formed between two non-metals. Unlike ionic compounds, these compounds use prefixes to indicate the number of atoms of each element in the formula.\n\nThe prefixes used are:\n- mono- (1) - often omitted for the first element\n- di- (2)\n- tri- (3)\n- tetra- (4)\n- penta- (5)\n- hexa- (6)\n- hepta- (7)\n- octa- (8)\n- nona- (9)\n- deca- (10)\n\nTo name a binary molecular compound:\n1. Name the first element using its element name\n2. Name the second element, changing its ending to \'-ide\'\n3. Add prefixes to both elements to indicate the number of atoms\n\nExamples:\n- CO: carbon monoxide (mono- is omitted for the first element)\n- CO2: carbon dioxide\n- N2O4: dinitrogen tetroxide\n- SF6: sulfur hexafluoride\n\nNote: When the prefix ends with \'a\' or \'o\' and the element name begins with \'o\', one of the vowels is often dropped (e.g., \'mono-oxide\' becomes \'monoxide\').',
            objectives: [
              'Understand the difference between ionic and molecular compounds',
              'Learn the prefixes used to indicate the number of atoms',
              'Name binary molecular compounds correctly',
              'Write chemical formulas from the names of molecular compounds'
            ]
          },
          'module3': {
            _id: 'module3',
            title: 'Naming Acids and Bases',
            description: 'Learn the rules for naming acids and bases in chemistry.',
            level: 3,
            content: 'Acids are compounds that release hydrogen ions in water. The naming of acids depends on the anion involved.\n\nFor binary acids (containing hydrogen and one other element):\n- Use the prefix "hydro-"\n- Add the root of the second element\n- Add the suffix "-ic"\n- End with "acid"\n\nExamples:\n- HCl: hydrochloric acid\n- H2S: hydrosulfuric acid\n\nFor oxyacids (containing hydrogen, oxygen, and another element):\n- If the anion ends in "-ate", use the root of the central element with "-ic acid"\n- If the anion ends in "-ite", use the root of the central element with "-ous acid"\n\nExamples:\n- H2SO4 (sulfate): sulfuric acid\n- H2SO3 (sulfite): sulfurous acid\n\nBases are compounds that accept hydrogen ions or donate hydroxide ions. Many common bases have the hydroxide (OH-) ion.\n\nExamples:\n- NaOH: sodium hydroxide\n- Ca(OH)2: calcium hydroxide',
            objectives: [
              'Understand the difference between binary acids and oxyacids',
              'Name common acids and bases correctly',
              'Recognize acid and base formulas',
              'Understand the relationship between acid names and their anions'
            ]
          }
        };
        
        // Demo questions for each module
        const demoQuestions = {
          'module1': [
            {
              _id: 'q1_1',
              text: 'What is the name of the compound NaCl?',
              type: 'fill-in-blank',
              difficulty: 1,
              correctAnswer: 'sodium chloride',
              explanation: 'NaCl is composed of sodium (Na) and chlorine (Cl). When naming binary ionic compounds, we name the metal first (sodium) followed by the non-metal with an -ide ending (chloride).',
              hints: [
                'This is a binary ionic compound.',
                'The first element is sodium (Na).',
                'The second element is chlorine (Cl), which becomes chloride in the compound name.'
              ],
              points: 10
            },
            {
              _id: 'q1_2',
              text: 'What is the name of Fe2O3?',
              type: 'multiple-choice',
              difficulty: 2,
              options: [
                { text: 'iron oxide', isCorrect: false },
                { text: 'iron(III) oxide', isCorrect: true },
                { text: 'iron(II) oxide', isCorrect: false },
                { text: 'diiron trioxide', isCorrect: false }
              ],
              explanation: 'Fe2O3 contains iron in the +3 oxidation state. When naming compounds with transition metals, we need to specify the oxidation state using Roman numerals. The correct name is iron(III) oxide.',
              hints: [
                'This compound contains a transition metal (Fe) and oxygen.',
                'You need to determine the oxidation state of iron.',
                'The formula shows 2 iron atoms and 3 oxygen atoms.'
              ],
              points: 15
            }
          ],
          'module2': [
            {
              _id: 'q2_1',
              text: 'What is the name of the compound CO2?',
              type: 'fill-in-blank',
              difficulty: 1,
              correctAnswer: 'carbon dioxide',
              explanation: 'CO2 is a binary molecular compound with one carbon atom and two oxygen atoms. We use the prefix "di-" to indicate two oxygen atoms, giving us carbon dioxide.',
              hints: [
                'This is a binary molecular compound (two non-metals).',
                'The first element is carbon (C).',
                'The second element is oxygen (O), and there are two oxygen atoms.'
              ],
              points: 10
            },
            {
              _id: 'q2_2',
              text: 'What is the name of N2O5?',
              type: 'multiple-choice',
              difficulty: 2,
              options: [
                { text: 'nitrogen oxide', isCorrect: false },
                { text: 'dinitrogen pentoxide', isCorrect: true },
                { text: 'nitrogen pentoxide', isCorrect: false },
                { text: 'dinitrogen oxide', isCorrect: false }
              ],
              explanation: 'N2O5 contains two nitrogen atoms and five oxygen atoms. We use the prefixes "di-" for two nitrogen atoms and "penta-" for five oxygen atoms, giving us dinitrogen pentoxide.',
              hints: [
                'This is a binary molecular compound (two non-metals).',
                'You need to use prefixes to indicate the number of atoms.',
                'There are 2 nitrogen atoms and 5 oxygen atoms.'
              ],
              points: 15
            }
          ]
        };
        
        // Set module data based on moduleId
        if (demoModules[moduleId]) {
          setModule(demoModules[moduleId]);
        }
        
        // Set questions for this module
        if (demoQuestions[moduleId]) {
          setQuestions(demoQuestions[moduleId]);
        }
        
        // Set demo user progress
        setUserProgress({
          score: 0,
          completed: false,
          questionsAnswered: []
        });
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
      // For demo purposes, simulate AI evaluation
      const currentQuestion = questions[currentQuestionIndex];
      let isCorrect = false;
      let feedback = '';
      
      if (currentQuestion.type === 'multiple-choice') {
        const correctOption = currentQuestion.options.find(option => option.isCorrect);
        isCorrect = answer === correctOption.text;
      } else if (currentQuestion.type === 'fill-in-blank') {
        isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
      }
      
      if (isCorrect) {
        feedback = 'Correct! ' + currentQuestion.explanation;
      } else {
        feedback = 'Not quite. ' + currentQuestion.explanation;
      }
      
      // Set feedback
      setFeedback({
        isCorrect: isCorrect,
        message: feedback,
        explanation: currentQuestion.explanation,
        pointsEarned: isCorrect ? currentQuestion.points : 0
      });
      
      // Update user progress
      setUserProgress({
        ...userProgress,
        score: userProgress.score + (isCorrect ? currentQuestion.points : 0),
        completed: currentQuestionIndex === questions.length - 1 && isCorrect
      });
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