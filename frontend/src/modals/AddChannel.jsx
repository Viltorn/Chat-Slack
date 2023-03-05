import React, { useEffect, useRef } from 'react';
// import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import {
  Modal,
  FormGroup,
  FormControl,
  Button,
  FormLabel,
} from 'react-bootstrap';
import { actions as modalActions } from '../slices/modalsSlice';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { ChannelSchema } from '../utils/validation';

const AddChannel = ({ socket, notify }) => {
  const { t } = useTranslation();
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
    validationSchema: ChannelSchema(channelNames),
    onSubmit: (values) => {
      try {
        socket.emit('newChannel', { name: values.channel }, (response) => {
          if (response.status === 'ok') {
            const channel = response.data;
            const { id } = channel;
            dispatch(channelsActions.changeCurrentChannel(id));
            notify('add');
            handleClose();
          } else {
            formik.setSubmitting(false);
            notify('error');
          }
        });
      } catch (err) {
        console.log(err);
        notify('error');
        formik.setSubmitting(false);
      }
    },
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>{t('AddChannel')}</Modal.Title>
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
                isInvalid={formik.errors.channel}
                className="mb-2"
              />
              {formik.errors.channel ? (
                <div className="invalid-feedback">{t(`errors.${formik.errors.channel}`)}</div>
              ) : null}
              <FormLabel htmlFor="channel" className="visually-hidden">{t('ChannelName')}</FormLabel>
              <FormGroup className="d-flex justify-content-end">
                <Button variant="secondary" onClick={handleClose} className="me-2" data-bs-dismiss="modal">{t('Cancel')}</Button>
                <Button variant="primary" type="submit">{t('Send')}</Button>
              </FormGroup>
            </FormGroup>
          </fieldset>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
