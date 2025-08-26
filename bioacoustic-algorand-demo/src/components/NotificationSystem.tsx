import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 = persistent
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: number;
}

interface NotificationState {
  notifications: Notification[];
}

type NotificationAction = 
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' };

const initialState: NotificationState = {
  notifications: []
};

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: []
      };
    default:
      return state;
  }
};

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration ?? 5000 // Default 5 seconds
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    // Auto-remove notification after duration (unless persistent)
    if (newNotification.duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        addNotification,
        removeNotification,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const NotificationItem: React.FC<{
  notification: Notification;
  onRemove: (id: string) => void;
}> = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLeaving, setIsLeaving] = React.useState(false);

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "border-l-4 shadow-lg";
    switch (notification.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-500`;
    }
  };

  const transformClass = isVisible && !isLeaving 
    ? 'translate-x-0 opacity-100' 
    : isLeaving 
    ? 'translate-x-full opacity-0' 
    : 'translate-x-full opacity-0';

  return (
    <div
      className={`${getStyles()} rounded-r-lg p-4 mb-3 transition-all duration-300 ease-in-out transform ${transformClass}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-semibold text-gray-900">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-700 mt-1">
            {notification.message}
          </p>
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="space-y-2">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Hook for common notification patterns in bio-token app
 */
export const useBioTokenNotifications = () => {
  const { addNotification } = useNotifications();

  const notifyTokenCreated = useCallback((assetId: number, tokenCount: number, species?: string) => {
    addNotification({
      type: 'success',
      title: 'Bio-Token Created Successfully!',
      message: `Created ${tokenCount} tokens for ${species || 'unknown species'}. Asset ID: ${assetId}`,
      duration: 8000
    });
  }, [addNotification]);

  const notifyTokenizationError = useCallback((error: string, isRetryable = false) => {
    addNotification({
      type: 'error',
      title: 'Tokenization Failed',
      message: error,
      duration: isRetryable ? 10000 : 0,
      action: isRetryable ? {
        label: 'Retry',
        onClick: () => window.location.reload()
      } : undefined
    });
  }, [addNotification]);

  const notifyWalletConnected = useCallback((address: string) => {
    const shortAddress = `${address.slice(0, 8)}...${address.slice(-8)}`;
    addNotification({
      type: 'success',
      title: 'Wallet Connected',
      message: `Connected to ${shortAddress}`,
      duration: 4000
    });
  }, [addNotification]);

  const notifyBlockchainInteraction = useCallback((action: string, txId?: string) => {
    addNotification({
      type: 'info',
      title: 'Blockchain Transaction',
      message: `${action}${txId ? `. TX: ${txId.slice(0, 12)}...` : ''}`,
      duration: 6000
    });
  }, [addNotification]);

  const notifyNetworkIssue = useCallback((network: string) => {
    addNotification({
      type: 'warning',
      title: 'Network Issue',
      message: `Unable to connect to ${network}. Please check your internet connection.`,
      duration: 0,
      action: {
        label: 'Retry',
        onClick: () => window.location.reload()
      }
    });
  }, [addNotification]);

  const notifySpeciesIdentified = useCallback((species: string, confidence: number) => {
    addNotification({
      type: 'info',
      title: 'Species Identified',
      message: `Detected ${species} with ${(confidence * 100).toFixed(1)}% confidence`,
      duration: 5000
    });
  }, [addNotification]);

  return {
    notifyTokenCreated,
    notifyTokenizationError,
    notifyWalletConnected,
    notifyBlockchainInteraction,
    notifyNetworkIssue,
    notifySpeciesIdentified
  };
};

export default NotificationSystem;