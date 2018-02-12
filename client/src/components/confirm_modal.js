import React from 'react';

const ConfirmModal = props => {
  return (
    <div className="modal">
      <div className="modal-background" />
      <div className="modal-content">
        <input className="" placeholder={props.task} />
      </div>
    </div>
  );
};

export default ConfirmModal;
