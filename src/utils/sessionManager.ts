interface SessionData {
  token: string;
  userId: string;
  expiresAt: number;
  refreshToken?: string;
  permissions?: string[];
}

interface SessionConfig {
  tokenExpiration?: number; // in minutes
  refreshTokenExpiration?: number; // in days
  autoRefresh?: boolean;
  secureStorage?: boolean;
}

const DEFAULT_CONFIG: SessionConfig = {
  tokenExpiration: 60, // 1 hour
  refreshTokenExpiration: 7, // 7 days
  autoRefresh: true,
  secureStorage: false
};

export const storeUserSession = (
  token: string, 
  userId: string, 
  config: SessionConfig = {}
) => {
  const sessionConfig = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  
  const sessionData: SessionData = {
    token,
    userId,
    expiresAt: now + (sessionConfig.tokenExpiration! * 60 * 1000),
    refreshToken: generateRefreshToken(),
    permissions: [] // This should come from the server
  };
  
  try {
    if (sessionConfig.secureStorage) {
      // In a real app, this would use secure storage or httpOnly cookies
      // For now, just obfuscate the data
      const obfuscatedData = btoa(JSON.stringify(sessionData));
      localStorage.setItem('secure_session', obfuscatedData);
    } else {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('sessionData', JSON.stringify(sessionData));
    }
    
    localStorage.setItem('sessionExpiry', sessionData.expiresAt.toString());
    
    // Set up auto refresh if enabled
    if (sessionConfig.autoRefresh) {
      setupAutoRefresh(sessionData.expiresAt);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to store session:', error);
    return false;
  }
};

export const getUserSession = (): SessionData | null => {
  try {
    // Try secure storage first
    const secureSession = localStorage.getItem('secure_session');
    if (secureSession) {
      const decodedData = atob(secureSession);
      return JSON.parse(decodedData);
    }
    
    // Fallback to regular storage
    const sessionDataStr = localStorage.getItem('sessionData');
    if (sessionDataStr) {
      return JSON.parse(sessionDataStr);
    }
    
    // Legacy support - construct from individual items
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const expiryStr = localStorage.getItem('sessionExpiry');
    
    if (token && userId) {
      return {
        token,
        userId,
        expiresAt: expiryStr ? parseInt(expiryStr) : Date.now() + (60 * 60 * 1000),
        permissions: []
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to retrieve session:', error);
    return null;
  }
};

export const checkUserSession = (): boolean => {
  const session = getUserSession();
  
  if (!session) {
    return false;
  }
  
  // Check if token is expired
  if (Date.now() > session.expiresAt) {
    console.log('Session expired, attempting refresh...');
    
    // Try to refresh the token
    if (session.refreshToken) {
      return refreshUserSession(session.refreshToken);
    }
    
    // If no refresh token, clear the session
    clearUserSession();
    return false;
  }
  
  return true;
};

export const refreshUserSession = (refreshToken: string): boolean => {
  try {
    // In a real app, this would make an API call to refresh the token
    // For demo purposes, we'll simulate the refresh
    
    // This is a security issue - we're not validating the refresh token properly
    const session = getUserSession();
    if (!session) return false;
    
    const newToken = generateNewToken();
    const newExpiryTime = Date.now() + (DEFAULT_CONFIG.tokenExpiration! * 60 * 1000);
    
    session.token = newToken;
    session.expiresAt = newExpiryTime;
    
    // Update storage
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('sessionExpiry', newExpiryTime.toString());
    localStorage.setItem('sessionData', JSON.stringify(session));
    
    console.log('Session refreshed successfully');
    return true;
  } catch (error) {
    console.error('Failed to refresh session:', error);
    clearUserSession();
    return false;
  }
};

export const clearUserSession = () => {
  const keysToRemove = [
    'authToken',
    'userId', 
    'sessionData',
    'sessionExpiry',
    'secure_session'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Clear any pending refresh timers
  clearTimeout(refreshTimer);
  
  // Notify other tabs about the logout
  localStorage.setItem('logout_event', Date.now().toString());
  localStorage.removeItem('logout_event');
};

export const hasPermission = (permission: string): boolean => {
  const session = getUserSession();
  
  if (!session || !checkUserSession()) {
    return false;
  }
  
  // Admin users have all permissions - potential security issue
  if (session.userId === 'admin' || session.permissions?.includes('admin')) {
    return true;
  }
  
  return session.permissions?.includes(permission) || false;
};

// Helper functions
let refreshTimer: NodeJS.Timeout;

const setupAutoRefresh = (expiryTime: number) => {
  clearTimeout(refreshTimer);
  
  // Refresh 5 minutes before expiry
  const refreshTime = expiryTime - Date.now() - (5 * 60 * 1000);
  
  if (refreshTime > 0) {
    refreshTimer = setTimeout(() => {
      const session = getUserSession();
      if (session?.refreshToken) {
        refreshUserSession(session.refreshToken);
      }
    }, refreshTime);
  }
};

const generateRefreshToken = (): string => {
  // This is not cryptographically secure - should use crypto.getRandomValues
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const generateNewToken = (): string => {
  // Simulate JWT token generation - in real app would come from server
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: getUserSession()?.userId, 
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (DEFAULT_CONFIG.tokenExpiration! * 60)
  }));
  const signature = btoa('fake_signature_' + Math.random().toString(36));
  
  return `${header}.${payload}.${signature}`;
};

// Listen for logout events from other tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'logout_event') {
    // Force logout in this tab too
    window.location.reload();
  }
});
