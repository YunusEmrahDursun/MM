import React from 'react';
import './Modal.css';
interface ModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h5>{title}</h5>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn" onClick={onClose}>İptal</button>
          <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>Sil</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
