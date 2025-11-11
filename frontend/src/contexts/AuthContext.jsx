import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage or JWT
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Helper: login (store user)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ✅ Helper: logout (clear user)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);
