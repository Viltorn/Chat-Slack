import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import React, { useState, useMemo } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './slices/index.js';
import App from './components/App';
import LoginForm from './components/LoginForm.jsx';
import ErrorPage from './components/error-page.jsx';
import SignUpForm from './components/SignUpForm.jsx';
import resources from './locales/index.js';
import AuthContext from './contexts/index.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/signup',
    element: <SignUpForm />,
  },
]);

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
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

const init = async () => {
  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      debug: true,
      interpolation: {
        escapeValue: false,
      },
      resources,
      fallbackLng: 'ru',
    });

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Provider store={store}>
          <div className="d-flex flex-column h-100">
            <RouterProvider router={router} />
          </div>
        </Provider>
      </AuthProvider>
    </I18nextProvider>
  );
};

export default init;
