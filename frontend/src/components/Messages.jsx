import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import routes from '../routes.js';
import Message from './Message.jsx';

const Messages = () => {
  const { currentChannel, currentId } = useSelector((state) => {
    const id = state.channelsReducer.currentChannelId;
    const current = state.channelsReducer.channels.find((channel) => channel.id === id);
    console.log(current);
    return { currentChannel: current, currentId: id };
  });

  const messages = useSelector((state) => state.messagesReducer.messages
    .filter((message) => message.channelId === currentId));

  const inputEl = useRef();

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async (values) => {
      try {
        const res = await axios.post(routes.loginPath(), values);
        if (res.status === 200) {
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          inputEl.current.select();
          return;
        }
        throw err;
      }
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
            {messages.length}
            &nbsp;сообщение
          </span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {messages.map((message) => <Message key={message.id} message={message} />)}
        </div>
        <div className="mt-auto px-5 py-3">
          <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
            <Form.Group className="input-group has-validation">
              <Form.Control
                className="border-0 p-0 ps-2 form-control"
                onChange={formik.handleChange}
                value={formik.values.message}
                placeholder="Введите сообщение..."
                name="message"
                id="message"
                autoComplete="message"
                required
                ref={inputEl}
              />
              <button
                type="submit"
                className="btn btn-group-vertical"
                disabled={!formik.dirty || formik.isSubmitting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                </svg>
                <span className="visually-hidden">Отправить</span>
              </button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
