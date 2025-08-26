import React from 'react';
import { Loader2, Zap, Leaf, Globe } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  submessage?: string;
  variant?: 'default' | 'bio' | 'blockchain' | 'full-screen';
}

/**
 * Comprehensive loading spinner with various styles for different contexts
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message = 'Loading...',
  submessage,
  variant = 'default'
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const containerClasses = {
    default: 'flex items-center justify-center p-4',
    bio: 'flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl',
    blockchain: 'flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl',
    'full-screen': 'fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm z-50'
  };

  if (variant === 'bio') {
    return (
      <div className={containerClasses[variant]}>
        <div className="relative">
          {/* Animated bio-inspired circles */}
          <div className="absolute inset-0">
            <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute inset-2">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-ping"></div>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-green-600 animate-bounce" />
          </div>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-900">{message}</p>
        {submessage && (
          <p className="mt-2 text-sm text-gray-600 text-center">{submessage}</p>
        )}
      </div>
    );
  }

  if (variant === 'blockchain') {
    return (
      <div className={containerClasses[variant]}>
        <div className="relative">
          {/* Blockchain-inspired animation */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 bg-blue-500 rounded-sm animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-900">{message}</p>
        {submessage && (
          <p className="mt-2 text-sm text-gray-600 text-center">{submessage}</p>
        )}
      </div>
    );
  }

  if (variant === 'full-screen') {
    return (
      <div className={containerClasses[variant]}>
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <Globe className="w-8 h-8 text-blue-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{message}</h3>
            {submessage && (
              <p className="text-gray-600">{submessage}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default spinner
  return (
    <div className={containerClasses[variant]}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {message && variant !== 'default' && (
        <p className="ml-3 text-gray-700">{message}</p>
      )}
    </div>
  );
};

/**
 * Skeleton loader for content that's loading
 */
export const SkeletonLoader: React.FC<{
  lines?: number;
  height?: string;
  className?: string;
}> = ({ lines = 3, height = 'h-4', className = '' }) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`bg-gray-200 rounded ${height}`}
          style={{ width: `${90 - i * 10}%` }}
        ></div>
      ))}
    </div>
  );
};

/**
 * Progress bar with steps for tokenization process
 */
export const ProgressBar: React.FC<{
  currentStep: number;
  totalSteps: number;
  steps: string[];
  variant?: 'default' | 'bio';
}> = ({ currentStep, totalSteps, steps, variant = 'default' }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  const barColor = variant === 'bio' ? 'bg-green-500' : 'bg-blue-500';
  const textColor = variant === 'bio' ? 'text-green-700' : 'text-blue-700';

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className={`${barColor} h-2 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Current step indicator */}
      <div className="flex justify-between items-center text-sm">
        <span className={`font-semibold ${textColor}`}>
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-gray-600">
          {progressPercentage.toFixed(0)}% Complete
        </span>
      </div>

      {/* Step description */}
      {steps[currentStep - 1] && (
        <p className="text-sm text-gray-700 mt-2">
          {steps[currentStep - 1]}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;