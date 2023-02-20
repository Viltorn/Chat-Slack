import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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

const RenameChannel = ({ socket, notify }) => {
  const { t } = useTranslation();
  const inputEl = useRef();
  const dispatch = useDispatch();
  const { channels } = useSelector((state) => state.channelsReducer);
  const { id } = useSelector((state) => state.modalsReducer);
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
        .notOneOf(channelNames, 'Unique')
        .max(20, 'Max20')
        .min(3, 'Min3'),
    }),
    onSubmit: (values) => {
      socket.emit('renameChannel', { id, name: values.channel }, (response) => {
        if (response.status === 'ok') {
          handleClose();
          notify('rename');
        } else {
          notify('error');
          formik.setSubmitting(false);
        }
      });
    },
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>{t('RenameChannel')}</Modal.Title>
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
                isInvalid={formik.errors.channel}
                name="channel"
                className="mb-2"
              />
              {formik.touched.channel && formik.errors.channel ? (
                <div className="invalid-feedback">{t(`errors.${formik.errors.channel}`)}</div>
              ) : null}
              <FormLabel htmlFor="name" className="visually-hidden">{t('Entername')}</FormLabel>
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

export default RenameChannel;
