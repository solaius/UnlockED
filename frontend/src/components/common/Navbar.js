import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">UnlockED</Link>
        
        <div className="navbar-menu">
          {currentUser ? (
            <>
              <span className="navbar-text">
                Welcome, {currentUser.username}
              </span>
              
              {currentUser.role === 'teacher' && (
                <Link to="/teacher" className="navbar-link">
                  Teacher Dashboard
                </Link>
              )}
              
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
              
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;