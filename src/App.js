import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './LandingPage';

// Lazy load the RecentActivities component for better performance
const RecentActivities = React.lazy(() => import('./RecentActivities'));

// Only load performance monitor in development
const PerformanceMonitor = React.lazy(() => 
  process.env.NODE_ENV === 'development' 
    ? import('./components/PerformanceMonitor') 
    : Promise.resolve({ default: () => null })
);

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#F25C05',
    fontSize: '1.2rem',
    fontWeight: '600'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(242, 92, 5, 0.3)',
        borderTop: '4px solid #F25C05',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      Loading activities...
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        {/* Performance monitoring in development */}
        {process.env.NODE_ENV === 'development' && (
          <Suspense fallback={null}>
            <PerformanceMonitor />
          </Suspense>
        )}
        
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Recent Activities Route - Lazy loaded */}
          <Route 
            path="/recent-activities" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RecentActivities />
              </Suspense>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
