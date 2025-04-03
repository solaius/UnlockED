import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, teacherOnly = false }) => {
  const { currentUser, loading } = useContext(AuthContext);

  // For demonstration purposes, bypass authentication
  const demoUser = {
    id: 'demo-user',
    username: 'Demo User',
    email: 'demo@example.com',
    role: teacherOnly ? 'teacher' : 'student',
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

  if (loading) {
    return <div className="container text-center mt-5">Loading...</div>;
  }

  // Use the demo user if no current user exists
  const user = currentUser || demoUser;

  // Only redirect for teacher routes if explicitly required
  if (teacherOnly && user.role !== 'teacher') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;