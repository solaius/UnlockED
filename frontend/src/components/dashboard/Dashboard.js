import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const Dashboard = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        const res = await axios.get('http://localhost:5000/api/modules', config);
        
        if (res.data.success) {
          setModules(res.data.data);
        }
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
        <h1>Welcome to UnlockED, {currentUser.username}!</h1>
        <p className="dashboard-subtitle">
          Your personalized chemistry learning platform
        </p>
        
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-label">Current Level:</span>
            <span className="stat-value">{currentUser.progress?.currentLevel || 1}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Points Earned:</span>
            <span className="stat-value">{currentUser.progress?.points || 0}</span>
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
                  module.level > currentUser.progress?.currentLevel 
                    ? 'module-locked' 
                    : ''
                }`}
              >
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
                <div className="module-meta">
                  <span className="module-level">Level {module.level}</span>
                  {module.level > currentUser.progress?.currentLevel ? (
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
        
        {currentUser.badges && currentUser.badges.length > 0 ? (
          <div className="badges-grid">
            {currentUser.badges.map((badge, index) => (
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