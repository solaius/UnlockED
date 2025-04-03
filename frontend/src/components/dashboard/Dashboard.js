import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const Dashboard = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  // Demo user for demonstration purposes
  const demoUser = currentUser || {
    id: 'demo-user',
    username: 'Demo User',
    email: 'demo@example.com',
    role: 'student',
    progress: {
      currentLevel: 2,
      points: 75,
      completedLessons: []
    },
    badges: [
      {
        name: 'Ion Initiate',
        description: 'Completed your first ionic compound naming exercise',
        dateEarned: new Date()
      }
    ]
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        // For demo purposes, use sample modules instead of API call
        const demoModules = [
          {
            _id: 'module1',
            title: 'Introduction to Chemical Nomenclature',
            description: 'Learn the basics of naming chemical compounds and understanding chemical formulas.',
            level: 1,
            content: 'Chemical nomenclature is the system of naming chemical compounds...',
            objectives: [
              'Identify the difference between ionic and molecular compounds',
              'Name binary ionic compounds correctly',
              'Understand how to indicate charges for transition metals',
              'Recognize common chemical formulas and their names'
            ]
          },
          {
            _id: 'module2',
            title: 'Naming Binary Molecular Compounds',
            description: 'Learn how to name compounds formed between two non-metals.',
            level: 2,
            content: 'Binary molecular compounds are formed between two non-metals...',
            objectives: [
              'Understand the difference between ionic and molecular compounds',
              'Learn the prefixes used to indicate the number of atoms',
              'Name binary molecular compounds correctly',
              'Write chemical formulas from the names of molecular compounds'
            ]
          },
          {
            _id: 'module3',
            title: 'Naming Acids and Bases',
            description: 'Learn the rules for naming acids and bases in chemistry.',
            level: 3,
            content: 'Acids are compounds that release hydrogen ions in water...',
            objectives: [
              'Understand the difference between binary and oxyacids',
              'Name common acids and bases correctly',
              'Recognize acid and base formulas',
              'Understand the relationship between acid names and their anions'
            ]
          }
        ];
        
        setModules(demoModules);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to load modules. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModules();
  }, []);

  if (loading) {
    return <div className="container text-center mt-5">Loading modules...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to UnlockED, {demoUser.username}!</h1>
        <p className="dashboard-subtitle">
          Your personalized chemistry learning platform
        </p>
        
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-label">Current Level:</span>
            <span className="stat-value">{demoUser.progress?.currentLevel || 1}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Points Earned:</span>
            <span className="stat-value">{demoUser.progress?.points || 0}</span>
          </div>
        </div>
      </div>
      
      {error && <div className="alert-error">{error}</div>}
      
      <div className="modules-container">
        <h2>Chemistry Nomenclature Modules</h2>
        
        {modules.length === 0 ? (
          <p>No modules available yet. Check back soon!</p>
        ) : (
          <div className="modules-grid">
            {modules.map((module) => (
              <div 
                key={module._id} 
                className={`module-card ${
                  module.level > demoUser.progress?.currentLevel 
                    ? 'module-locked' 
                    : ''
                }`}
              >
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
                <div className="module-meta">
                  <span className="module-level">Level {module.level}</span>
                  {module.level > demoUser.progress?.currentLevel ? (
                    <span className="module-status">Locked</span>
                  ) : (
                    <Link 
                      to={`/module/${module._id}`} 
                      className="module-button"
                    >
                      Start Learning
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="badges-container">
        <h2>Your Achievements</h2>
        
        {demoUser.badges && demoUser.badges.length > 0 ? (
          <div className="badges-grid">
            {demoUser.badges.map((badge, index) => (
              <div key={index} className="badge-card">
                <h3 className="badge-title">{badge.name}</h3>
                <p className="badge-description">{badge.description}</p>
                <span className="badge-date">
                  Earned on: {new Date(badge.dateEarned).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>Complete modules to earn badges!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;