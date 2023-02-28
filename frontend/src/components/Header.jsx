import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authContext from '../contexts/authContext.js';

const Header = () => {
  const { logOut, isLogged } = useContext(authContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const makeLogOut = () => {
    logOut();
    navigate('/login');
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">
          Hexlet Chat
        </a>
        {isLogged() ? (
          <button type="button" onClick={makeLogOut} className="btn btn-primary">{t('Exit')}</button>
        ) : null}
      </div>
    </nav>
  );
};

export default Header;
