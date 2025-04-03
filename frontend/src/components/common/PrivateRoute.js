import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, teacherOnly = false }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="container text-center mt-5">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (teacherOnly && currentUser.role !== 'teacher') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;