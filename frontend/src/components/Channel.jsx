import React from 'react';
import cn from 'classnames';
import { Dropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';

const ButtonEl = ({ name, classes, change }) => (
  <button
    onClick={change}
    type="button"
    className={classes}
  >
    <span className="me-1">#</span>
    {name}
  </button>
);

const Channel = ({ channel }) => {
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
          <Dropdown.Toggle variant="" id="dropdown-basic" />

          <Dropdown.Menu>
            <Dropdown.Item
              href="#"
              onClick={() => dispatch(modalsActions.openModal({ type: 'removeChannel', id }))}
            >
              Удалить
            </Dropdown.Item>
            <Dropdown.Item
              href="#"
              onClick={() => dispatch(modalsActions.openModal({ type: 'renameChannel', id }))}
            >
              Переименовать
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
