import React, { useContext } from 'react';
import AlertContext from '../../contexts/alerts/alertContext';

const Alert = () => {
  const { alerts } = useContext(AlertContext);
  return (
    <div className='alert-placeholder'>
      {(alerts.length !== 0) && alerts.map(alert =>
        <div key={alert.id} className='alert alert-primary'>
          <i className='fas fa-exclamation-circle'/> {alert.msg}
        </div>
      )}
    </div>
  );
};

export default Alert;