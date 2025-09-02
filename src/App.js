import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './LandingPage';
import RecentActivities from './RecentActivities';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Recent Activities Route */}
          <Route path="/recent-activities" element={<RecentActivities />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
