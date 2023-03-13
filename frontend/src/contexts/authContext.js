import { createContext } from 'react';
import { getAuthToken } from '../utils/getAuthHeader.js';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const isLogged = () => {
    if (getAuthToken()) {
      return true;
    }
    return false;
  };

  const logIn = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
  };
  const logOut = () => {
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      logIn,
      logOut,
      isLogged,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
