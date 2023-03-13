import React, {
  useEffect,
  useContext,
  useCallback,
  useState,
} from 'react';
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
import axios from 'axios';
import { io } from 'socket.io-client';
import routes from '../routes';
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

const App = ({ notify }) => {
  const dispatch = useDispatch();
  const { logOut } = useContext(authContext);
  const [connected, setConnnectStatus] = useState(true);

  const showError = useCallback(() => {
    notify('error');
  }, [notify]);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get(routes.defaultPath());
        if (response.status === 200) {
          setTimeout(() => checkServer(), 5000);
        }
      } catch (err) {
        logOut();
        showError();
        setConnnectStatus(false);
      }
    };
    checkServer();
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
  }, [dispatch, logOut, showError]);

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
        <Route path="/signup" element={connected ? <SignUpForm notify={notify} /> : <Navigate to="/login" />} />
        <Route path="*" element={connected ? <ErrorPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
