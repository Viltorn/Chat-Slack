import React from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';

const Channel = ({ channel }) => {
  const { name, id } = channel;
  const { currentChannelId } = useSelector((state) => state.channelsReducer);

  const changeChannel = (e) => {
    e.preventDefault();
  };

  return (
    <li className="nav-item w-100">
      <button
        onClick={changeChannel}
        type="button"
        className={cn('w-100', 'rounded-0', 'text-start', 'btn', { 'btn-secondary': id === currentChannelId })}
      >
        <span className="me-1">#</span>
        {name}
      </button>
    </li>
  );
};

export default Channel;
