import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import authContext from '../contexts/authContext.js';

const lngs = {
  ru: 'ру',
  en: 'en',
};

const Header = () => {
  const { logOut, isLogged } = useContext(authContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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
        <div className="btn-group col-auto" role="group" aria-label="outlined">
          {Object.keys(lngs).map((lng) => (
            <button key={lng} className={cn('btn', 'btn-outline-primary', { active: i18n.resolvedLanguage === lng })} type="button" onClick={() => i18n.changeLanguage(lng)}>
              {lngs[lng]}
            </button>
          ))}
        </div>
        {isLogged() ? (
          <button type="button" onClick={makeLogOut} className="btn btn-primary">{t('Exit')}</button>
        ) : null}
      </div>
    </nav>
  );
};

export default Header;
