import React, { useEffect, useCallback } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import routes from '../routes';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messageActions } from '../slices/messagesSlice.js';
import getModal from '../modals/index.js';
import getAuthHeader from '../utils/getAuthHeader.js';

const Chat = ({ notify, socket }) => {
  const dispatch = useDispatch();
  const { isOpened, type } = useSelector((state) => state.modalsReducer);

  const showError = useCallback(() => {
    notify('error');
  }, [notify]);

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
        const { data } = await axios.get(routes.dataPath(), {
          headers: getAuthHeader(),
        });
        const { channels, messages, currentChannelId } = data;
        dispatch(channelsActions.changeCurrentChannel(currentChannelId));
        dispatch(channelsActions.addChannels(channels));
        dispatch(messageActions.addMessages(messages));
      } catch (err) {
        if (!err.isAxiosError) {
          console.log(err);
          showError();
          throw Error('NetworkError');
        }
      }
    };
    getData();
  }, [dispatch, showError]);

  return (
    <>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <Channels />
          <Messages notify={notify} socket={socket} />
        </div>
      </div>
      {renderModal(isOpened, type)}
    </>
  );
};
export default Chat;
