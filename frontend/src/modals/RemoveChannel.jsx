import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  FormGroup,
  Button,
} from 'react-bootstrap';
import { actions as modalActions } from '../slices/modalsSlice';

const RemoveChannel = ({ socket }) => {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.modalsReducer);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const deleteChannel = () => {
    socket.emit('removeChannel', { id }, (response) => {
      if (response.status === 'ok') {
        handleClose();
      } else {
        console.log('Lost connection');
      }
    });
  };

  return (
    <Modal show>
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">Уверены?</p>
        <FormGroup className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleClose} className="me-2" data-bs-dismiss="modal">Отменить</Button>
          <Button variant="danger" onClick={deleteChannel}>Удалить</Button>
        </FormGroup>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
