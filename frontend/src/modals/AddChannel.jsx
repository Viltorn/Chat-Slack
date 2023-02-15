import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Modal,
  FormGroup,
  FormControl,
  Button,
  FormLabel,
} from 'react-bootstrap';
import { actions as modalActions } from '../slices/modalsSlice';
import { actions as channelsActions } from '../slices/channelsSlice.js';

const AddChannel = ({ socket }) => {
  const inputEl = useRef();
  const dispatch = useDispatch();
  const { channels } = useSelector((state) => state.channelsReducer);
  const channelNames = channels.map((channel) => channel.name);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const formik = useFormik({
    initialValues: {
      channel: '',
    },
    validationSchema: Yup.object({
      channel: Yup
        .string()
        .notOneOf(channelNames, 'Должно быть уникальным')
        .max(20, 'Максимум 20 символов')
        .min(3, 'Минимум 3 символа'),
    }),
    onSubmit: (values) => {
      socket.emit('newChannel', { name: values.channel }, (response) => {
        if (response.status === 'ok') {
          const channel = response.data;
          const { id } = channel;
          dispatch(channelsActions.changeCurrentChannel(id));
          handleClose();
        } else {
          console.log('Lost connection');
          formik.setSubmitting(false);
        }
      });
    },
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <fieldset disabled={formik.isSubmitting}>
            <FormGroup>
              <FormControl
                id="channel"
                type="text"
                ref={inputEl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.channel}
                data-testid="input-body"
                name="channel"
                className="mb-2"
              />
              {formik.touched.channel && formik.errors.channel ? (
                <div className="invalid-feedback">{formik.errors.channel}</div>
              ) : null}
              <FormLabel htmlFor="channel" className="visually-hidden">Введите имя</FormLabel>
              <FormGroup className="d-flex justify-content-end">
                <Button variant="secondary" onClick={handleClose} className="me-2" data-bs-dismiss="modal">Отменить</Button>
                <Button variant="primary" type="submit">Отправить</Button>
              </FormGroup>
            </FormGroup>
          </fieldset>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;