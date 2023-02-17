import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.js';

const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const makeLogOut = () => {
    auth.logOut();
    navigate('/login');
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">
          Hexlet Chat
        </a>
        {localStorage.getItem('user') ? (
          <button type="button" onClick={makeLogOut} className="btn btn-primary">{t('Exit')}</button>
        ) : null}
      </div>
    </nav>
  );
};

export default Header;
