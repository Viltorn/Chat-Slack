import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
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

const App = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isOpened, type } = useSelector((state) => state.modalsReducer);
  const { currentId, currentChannels } = useSelector((state) => {
    const id = state.channelsReducer.currentChannelId;
    const { channels } = state.channelsReducer;
    return { currentId: id, currentChannels: channels };
  });

  const notify = (status) => {
    const settings = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    };
    switch (status) {
      case 'add':
        toast.success(t('ChannelCreated'), settings);
        break;
      case 'remove':
        toast.success(t('ChannelRemove'), settings);
        break;
      case 'rename':
        toast.success(t('ChannelRenamed'), settings);
        break;
      default:
        toast.error(t('NetworkError'), settings);
        break;
    }
  };
  const renderModal = (status, option) => {
    if (!status) {
      return null;
    }
    const Modal = getModal(option);
    return <Modal notify={notify} socket={socket} />;
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(routes.statePath(), {
          headers: getAuthHeader(),
        });
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

  return localStorage.getItem('user') ? (
    <>
      <Header />
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <Channels />
          <Messages notify={notify} socket={socket} />
        </div>
      </div>
      {renderModal(isOpened, type)}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};
export default App;
