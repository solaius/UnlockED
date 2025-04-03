import React, { useState } from 'react';

const QuestionCard = ({ question, onSubmit, feedback, onNext }) => {
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (question.type === 'multiple-choice') {
      onSubmit(question._id, selectedOption);
    } else {
      onSubmit(question._id, answer);
    }
  };
  
  const handleOptionSelect = (optionText) => {
    setSelectedOption(optionText);
  };
  
  return (
    <div className="question-card">
      <h3 className="question-text">{question.text}</h3>
      
      {!feedback ? (
        <form onSubmit={handleSubmit} className="question-form">
          {question.type === 'multiple-choice' ? (
            <div className="options-list">
              {question.options.map((option, index) => (
                <div key={index} className="option-item">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="answer-option"
                    value={option.text}
                    checked={selectedOption === option.text}
                    onChange={() => handleOptionSelect(option.text)}
                    required
                  />
                  <label htmlFor={`option-${index}`}>{option.text}</label>
                </div>
              ))}
            </div>
          ) : (
            <div className="fill-blank-input">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here"
                required
              />
            </div>
          )}
          
          <button type="submit" className="submit-button">
            Submit Answer
          </button>
        </form>
      ) : (
        <div className={`feedback-container ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-header">
            {feedback.isCorrect ? (
              <span className="feedback-correct">Correct!</span>
            ) : (
              <span className="feedback-incorrect">Not quite right</span>
            )}
            
            {feedback.pointsEarned > 0 && (
              <span className="points-earned">+{feedback.pointsEarned} points</span>
            )}
          </div>
          
          <p className="feedback-message">{feedback.message}</p>
          
          {feedback.explanation && (
            <div className="explanation-box">
              <h4>Explanation:</h4>
              <p>{feedback.explanation}</p>
            </div>
          )}
          
          <button onClick={onNext} className="next-button">
            Next Question
          </button>
        </div>
      )}
      
      {question.hints && question.hints.length > 0 && !feedback && (
        <div className="hints-container">
          <details>
            <summary>Need a hint?</summary>
            <ul className="hints-list">
              {question.hints.map((hint, index) => (
                <li key={index} className="hint-item">{hint}</li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;