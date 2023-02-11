import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import routes from '../routes';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messageActions } from '../slices/messagesSlice.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('user'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const socket = io();

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(routes.statePath(), { headers: getAuthHeader() });
        const { channels, messages, currentChannelId } = data;
        dispatch(channelsActions.changeCurrentChannel(currentChannelId));
        dispatch(channelsActions.addChannels(channels));
        dispatch(messageActions.addMessages(messages));
      } catch (err) {
        console.log(err);
        throw err;
      }
    };
    getData();
  });

  return (
    !localStorage.getItem('user') ? <Navigate to="/login" state={{ from: location }} />
      : (
        <div className="h-100">
          <div className="d-flex flex-column h-100">
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <div className="row h-100 bg-white flex-md-row">
                <Channels />
                <Messages socket={socket} />
              </div>
            </div>
          </div>
        </div>
      )
  );
};
export default App;
