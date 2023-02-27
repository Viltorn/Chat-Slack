import { createContext, useState, useMemo } from 'react';
import getAuthHeader from '../utils/getAuthHeader.js';

const auth = getAuthHeader() !== null;

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(auth);

  const logIn = (data) => {
    setLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(data));
  };
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={useMemo(() => ({ logIn, logOut, loggedIn }), [loggedIn])}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
