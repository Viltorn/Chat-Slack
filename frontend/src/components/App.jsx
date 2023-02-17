import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import routes from '../routes';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import Header from './Header';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messageActions } from '../slices/messagesSlice.js';
import getModal from '../modals/index.js';

const socket = io();

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('user'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const renderModal = (isOpened, type) => {
  if (!isOpened) {
    return null;
  }
  const Modal = getModal(type);
  return <Modal socket={socket} />;
};

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isOpened, type } = useSelector((state) => state.modalsReducer);
  const { currentId, currentChannels } = useSelector((state) => {
    const id = state.channelsReducer.currentChannelId;
    const { channels } = state.channelsReducer;
    return { currentId: id, currentChannels: channels };
  });

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
  }, [dispatch]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.connected);
    });
    socket.on('newMessage', (payload) => {
      console.log(payload);
      dispatch(messageActions.addMessage(payload));
    });

    socket.on('newChannel', (payload) => {
      console.log(payload);
      dispatch(channelsActions.addChannel(payload));
    });

    socket.on('removeChannel', (payload) => {
      console.log(payload);
      const { id } = payload;
      dispatch(channelsActions.removeChannel(payload));
      if (id === currentId) {
        dispatch(channelsActions.changeCurrentChannel(currentChannels[0].id));
      }
    });

    socket.on('renameChannel', (payload) => {
      console.log(payload);
      dispatch(channelsActions.renameChannel(payload));
    });

    return () => {
      socket.off('connect');
      socket.off('newMessage');
      socket.off('newChannel');
      socket.off('removeChannel');
      socket.off('renameChannel');
    };
  }, [dispatch, currentId, currentChannels]);

  return (
    localStorage.getItem('user')
      ? (
        <>
          <Header />
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <Channels />
              <Messages socket={socket} />
            </div>
          </div>
          {(renderModal(isOpened, type))}
        </>
      ) : <Navigate to="/login" state={{ from: location }} />
  );
};
export default App;
