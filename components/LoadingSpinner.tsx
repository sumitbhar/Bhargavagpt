import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 rounded-full animate-pulse bg-pink-500"></div>
      <div className="w-2 h-2 rounded-full animate-pulse bg-pink-500" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 rounded-full animate-pulse bg-pink-500" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default LoadingSpinner;