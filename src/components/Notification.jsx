// Notification Component
import React, { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap';

const Notification = ({ message, type, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Toast show={show} onClose={() => setShow(false)} className={`notification-${type}`}>
      <Toast.Header>
        <strong className="mr-auto">Notification</strong>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

export default Notification;