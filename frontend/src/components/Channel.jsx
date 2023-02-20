import React from 'react';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import cn from 'classnames';
import { Dropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';

const ButtonEl = ({ name, classes, change }) => {
  const { i18n } = useTranslation();
  filter.loadDictionary(i18n.resolvedLanguage);
  return (
    <button
      onClick={change}
      type="button"
      className={classes}
    >
      <span className="me-1">#</span>
      {filter.clean(`${name}`)}
    </button>
  );
};

const Channel = ({ channel }) => {
  const { t } = useTranslation();
  const { name, id, removable } = channel;
  const { currentChannelId } = useSelector((state) => state.channelsReducer);
  const classes = cn({
    'w-100': true,
    'rounded-0': true,
    'text-start': true,
    'text-truncate': true,
    btn: true,
    'btn-secondary': id === currentChannelId,
  });
  const dispatch = useDispatch();

  const changeChannel = (e) => {
    e.preventDefault();
    if (id !== currentChannelId) {
      dispatch(channelsActions.changeCurrentChannel(id));
    }
  };

  return (
    <li className="nav-item w-100">
      {removable && (
        <Dropdown role="group" className="d-flex dropdown btn-group">
          <ButtonEl name={name} change={changeChannel} classes={classes} />
          <Dropdown.Toggle variant="" id="dropdown-basic">
            <span className="visually-hidden">{t('ChannelToogle')}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              href="#"
              onClick={() => dispatch(modalsActions.openModal({ type: 'removeChannel', id }))}
            >
              {t('Delete')}
            </Dropdown.Item>
            <Dropdown.Item
              href="#"
              onClick={() => dispatch(modalsActions.openModal({ type: 'renameChannel', id }))}
            >
              {t('Rename')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
      {!removable && (
        <ButtonEl change={changeChannel} name={name} classes={classes} />
      )}
    </li>
  );
};

export default Channel;
