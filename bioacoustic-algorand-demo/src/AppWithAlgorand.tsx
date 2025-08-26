import React from 'react';
import AlgorandTokenization from './components/AlgorandTokenization';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider, NotificationContainer } from './components/NotificationSystem';
import './App.css';

/**
 * Main App component with real Algorand blockchain integration
 * Includes comprehensive error handling and user feedback systems
 */
function AppWithAlgorand() {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log to console in development
    console.error('Application Error:', error);
    console.error('Error Info:', errorInfo);
    
    // In production, you would send this to a logging service
    // logErrorToService(error, errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <NotificationProvider>
        <div className="App min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          <AlgorandTokenization />
          <NotificationContainer />
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default AppWithAlgorand;