import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import Message from './Message.jsx';

const getUserName = () => {
  const userId = JSON.parse(localStorage.getItem('user'));
  return userId.username;
};

const Messages = ({ socket, notify }) => {
  const { t } = useTranslation();
  const user = getUserName();
  const { currentChannel, currentId } = useSelector((state) => {
    const id = state.channelsReducer.currentChannelId;
    const current = state.channelsReducer.channels.find((channel) => channel.id === id);
    return { currentChannel: current, currentId: id };
  });

  const messages = useSelector((state) => state.messagesReducer.messages
    .filter((message) => message.channelId === currentId));

  const inputEl = useRef();
  const formEl = useRef();

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: (values) => {
      socket.emit('newMessage', { body: values.body, channelId: currentId, username: user }, (response) => {
        if (response.status !== 'ok') {
          formik.setSubmitting(false);
          notify('error');
        }
      });
      formik.handleReset();
      inputEl.current.focus();
      formik.setSubmitting(false);
    },
  });

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            {currentChannel
              && (
                <b>
                  #
                  {currentChannel.name}
                </b>
              )}
          </p>
          <span className="text-muted">
            {t('messages.counter', { count: messages.length })}
          </span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {messages.map((message) => <Message key={message.id} message={message} />)}
        </div>
        <div className="mt-auto px-5 py-3">
          <Form ref={formEl} onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
            <Form.Group className="input-group has-validation">
              <Form.Control
                className="border-0 p-0 ps-2 form-control"
                onChange={formik.handleChange}
                aria-label="Новое сообщение"
                value={formik.values.body}
                placeholder={t('EnterMessage')}
                name="body"
                id="body"
                autoComplete="body"
                required
                ref={inputEl}
              />
              <button
                type="submit"
                disabled={!formik.dirty || formik.isSubmitting}
                className="btn btn-light btn-group-vertical"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                </svg>
                <span className="visually-hidden">{t('Send')}</span>
              </button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
