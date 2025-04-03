import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

// Context providers
import { AuthProvider } from './contexts/AuthContext';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import LearningModule from './components/learning/LearningModule';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/common/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="container">
            {/* Demo Navigation Links */}
            <div className="demo-links" style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px', textAlign: 'center' }}>
              <h3>Demo Navigation</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <Link to="/dashboard" style={{ padding: '8px 16px', background: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                  Student Dashboard
                </Link>
                <Link to="/teacher" style={{ padding: '8px 16px', background: '#2ecc71', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                  Teacher Dashboard
                </Link>
                <Link to="/module/module1" style={{ padding: '8px 16px', background: '#f39c12', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                  Module 1: Intro to Nomenclature
                </Link>
                <Link to="/module/module2" style={{ padding: '8px 16px', background: '#f39c12', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                  Module 2: Binary Compounds
                </Link>
              </div>
            </div>
            
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/module/:moduleId" 
                element={
                  <PrivateRoute>
                    <LearningModule />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/teacher" 
                element={
                  <PrivateRoute teacherOnly={true}>
                    <TeacherDashboard />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
