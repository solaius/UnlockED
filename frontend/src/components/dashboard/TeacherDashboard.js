import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    module: 'all',
    level: 'all',
    date: 'all'
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Demo modules data
        const demoModules = [
          {
            _id: 'module1',
            title: 'Introduction to Chemical Nomenclature',
            description: 'Learn the basics of naming chemical compounds and understanding chemical formulas.',
            level: 1
          },
          {
            _id: 'module2',
            title: 'Naming Binary Molecular Compounds',
            description: 'Learn how to name compounds formed between two non-metals.',
            level: 2
          },
          {
            _id: 'module3',
            title: 'Naming Acids and Bases',
            description: 'Learn the rules for naming acids and bases in chemistry.',
            level: 3
          }
        ];
        
        // Demo students data
        const demoStudents = [
          {
            id: 'student1',
            username: 'JohnDoe',
            email: 'john.doe@example.com',
            level: 2,
            points: 85,
            progress: [
              {
                module: { _id: 'module1', title: 'Introduction to Chemical Nomenclature', level: 1 },
                completed: true,
                score: 45,
                lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
              },
              {
                module: { _id: 'module2', title: 'Naming Binary Molecular Compounds', level: 2 },
                completed: false,
                score: 40,
                lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
              }
            ]
          },
          {
            id: 'student2',
            username: 'JaneSmith',
            email: 'jane.smith@example.com',
            level: 3,
            points: 120,
            progress: [
              {
                module: { _id: 'module1', title: 'Introduction to Chemical Nomenclature', level: 1 },
                completed: true,
                score: 50,
                lastAccessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
              },
              {
                module: { _id: 'module2', title: 'Naming Binary Molecular Compounds', level: 2 },
                completed: true,
                score: 70,
                lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
              }
            ]
          },
          {
            id: 'student3',
            username: 'MikeJohnson',
            email: 'mike.johnson@example.com',
            level: 1,
            points: 30,
            progress: [
              {
                module: { _id: 'module1', title: 'Introduction to Chemical Nomenclature', level: 1 },
                completed: false,
                score: 30,
                lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
              }
            ]
          }
        ];
        
        setModules(demoModules);
        setStudents(demoStudents);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };
  
  const exportCSV = () => {
    // Create CSV content
    let csvContent = 'Username,Email,Level,Points,Modules Completed\n';
    
    students.forEach(student => {
      const completedModules = student.progress.filter(p => p.completed).length;
      csvContent += `${student.username},${student.email},${student.level},${student.points},${completedModules}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_progress.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Apply filters
  const filteredStudents = students.filter(student => {
    // Filter by module
    if (filter.module !== 'all') {
      const hasModule = student.progress.some(
        p => p.module._id === filter.module
      );
      if (!hasModule) return false;
    }
    
    // Filter by level
    if (filter.level !== 'all' && student.level !== parseInt(filter.level)) {
      return false;
    }
    
    return true;
  });
  
  if (loading) {
    return <div className="container text-center mt-5">Loading dashboard...</div>;
  }
  
  return (
    <div className="teacher-dashboard-container">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <p className="dashboard-subtitle">
          Monitor student progress and performance
        </p>
      </div>
      
      {error && <div className="alert-error">{error}</div>}
      
      <div className="dashboard-controls">
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="module">Filter by Module:</label>
            <select
              id="module"
              name="module"
              value={filter.module}
              onChange={handleFilterChange}
            >
              <option value="all">All Modules</option>
              {modules.map(module => (
                <option key={module._id} value={module._id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="level">Filter by Level:</label>
            <select
              id="level"
              name="level"
              value={filter.level}
              onChange={handleFilterChange}
            >
              <option value="all">All Levels</option>
              {[...Array(5)].map((_, i) => (
                <option key={i} value={i + 1}>
                  Level {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button onClick={exportCSV} className="export-button">
          Export to CSV
        </button>
      </div>
      
      <div className="students-table-container">
        <h2>Student Progress</h2>
        
        {filteredStudents.length === 0 ? (
          <p>No students match the selected filters.</p>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Current Level</th>
                <th>Points</th>
                <th>Modules Completed</th>
                <th>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const completedModules = student.progress.filter(p => p.completed).length;
                const lastActivity = student.progress.length > 0
                  ? new Date(Math.max(...student.progress.map(p => new Date(p.lastAccessed))))
                  : null;
                
                return (
                  <tr key={student.id}>
                    <td>{student.username}</td>
                    <td>{student.email}</td>
                    <td>{student.level}</td>
                    <td>{student.points}</td>
                    <td>{completedModules} / {modules.length}</td>
                    <td>
                      {lastActivity 
                        ? lastActivity.toLocaleDateString() 
                        : 'No activity yet'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="performance-summary">
        <h2>Class Performance Summary</h2>
        
        <div className="summary-stats">
          <div className="stat-card">
            <h3>Average Level</h3>
            <p className="stat-value">
              {students.length > 0
                ? (students.reduce((sum, s) => sum + s.level, 0) / students.length).toFixed(1)
                : 'N/A'}
            </p>
          </div>
          
          <div className="stat-card">
            <h3>Average Points</h3>
            <p className="stat-value">
              {students.length > 0
                ? (students.reduce((sum, s) => sum + s.points, 0) / students.length).toFixed(0)
                : 'N/A'}
            </p>
          </div>
          
          <div className="stat-card">
            <h3>Total Students</h3>
            <p className="stat-value">{students.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;