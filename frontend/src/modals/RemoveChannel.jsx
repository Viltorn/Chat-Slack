import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  FormGroup,
  Button,
} from 'react-bootstrap';
import { actions as modalActions } from '../slices/modalsSlice';

const RemoveChannel = ({ socket, notify }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.modalsReducer);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const deleteChannel = () => {
    socket.emit('removeChannel', { id }, (response) => {
      if (response.status === 'ok') {
        handleClose();
        notify('remove');
      } else {
        notify('error');
        console.log('Lost connection');
      }
    });
  };

  return (
    <Modal show>
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>{t('DeleteChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">{t('YouSure')}</p>
        <FormGroup className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleClose} className="me-2" data-bs-dismiss="modal">{t('Cancel')}</Button>
          <Button variant="danger" onClick={deleteChannel}>{t('Delete')}</Button>
        </FormGroup>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
