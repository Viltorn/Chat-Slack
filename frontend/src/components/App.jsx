import React, { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messageActions } from '../slices/messagesSlice.js';
import LoginForm from './LoginForm.jsx';
import ErrorPage from './error-page.jsx';
import SignUpForm from './SignUpForm.jsx';
import Chat from './Chat.jsx';
import Header from './Header.jsx';
import authContext from '../contexts/authContext.js';

const socket = io();

const PrivateRoute = ({ children }) => {
  const { isLogged } = useContext(authContext);
  const location = useLocation();

  return (
    isLogged() ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const App = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
        toast.error(t('errors.NetworkError'), settings);
        break;
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.connected);
    });
    socket.on('newMessage', (payload) => {
      dispatch(messageActions.addMessage(payload));
    });

    socket.on('newChannel', (payload) => {
      dispatch(channelsActions.addChannel(payload));
    });

    socket.on('removeChannel', (payload) => {
      dispatch(channelsActions.removeChannel(payload));
    });

    socket.on('renameChannel', (payload) => {
      dispatch(channelsActions.renameChannel(payload));
    });

    return () => {
      socket.off('connect');
      socket.off('newMessage');
      socket.off('newChannel');
      socket.off('removeChannel');
      socket.off('renameChannel');
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={(
            <PrivateRoute>
              <Chat notify={notify} socket={socket} />
            </PrivateRoute>
          )}
        />
        <Route path="/login" element={<LoginForm notify={notify} />} />
        <Route path="/signup" element={<SignUpForm notify={notify} />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
