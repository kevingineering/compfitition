import React, { useContext } from 'react';
import AlertContext from '../../contexts/alerts/alertContext';

const Alert = () => {

 //console.log{'Alert')

  const { alert } = useContext(AlertContext);
  return (
    <div className='alert-placeholder'>
      {(Object.entries(alert).length === 0) ? null :
        <div className='alert alert-primary'>
          <i className='fas fa-exclamation-circle'/> {alert.msg}
        </div>
      }
    </div>
  );
};

export default Alert;