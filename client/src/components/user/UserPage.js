import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alerts/alertContext';
import UserInfo from './UserInfo';
import EditModule from './EditModule';
import PasswordModule from './PasswordModule';
import DeleteModule from './DeleteModule';

const UserPage = () => {

  console.log('UserPage')

  const authContext = useContext(AuthContext);
  const { user, updateUser, changeUserPassword, deleteUser, userError, clearUserError } = authContext;
  
  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlert } = alertContext;
  
  const [current, setCurrent] = useState({
    firstName: '',
    lastName: '',
    alias: '',
    isSearchable: true,
    email: '',
    oldPassword: '',
    newPassword: '',
    newPassword2: ''
  });

  const [passwordToggle, setPasswordToggle] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const [deleteToggle, setDeleteToggle] = useState(false);

  //populate current with user values
  useEffect(() => {
    setCurrent({...current, ...user});
    return () => {
      clearAlert();
    }
    //eslint-disable-next-line
  }, [user, editToggle]);

  //set alert if error
  useEffect(() => {
    if (userError) {
      switch(userError) {
        case 'User updated!':
          setEditToggle(false);
          break;
        case 'Password changed!':
          setPasswordToggle(false);
          setCurrent({...current, oldPassword: '', newPassword: '', newPassword2: ''});
          break;
        case 'User deleted':
          setDeleteToggle(false);
          break;
        default: 
          setAlert(userError);
      }
    }
    clearUserError();
    //eslint-disable-next-line
  }, [userError]);

  const handleChange = e => {
    setCurrent({...current, [e.target.name]: e.target.value});
  };
  
  const handleClick = () => {
    setCurrent({ ...current, isSearchable: !current.isSearchable });
  };

  return (
    <div className='form-container'>
      <h1>User Profile</h1>
      {editToggle && 
        <EditModule 
          current={current}
          handleChange={handleChange}
          handleClick={handleClick}
          setEditToggle={setEditToggle}
          setAlert={setAlert}
          updateUser={updateUser}
        />
      }
      {passwordToggle && 
        <PasswordModule
          current={current}
          handleChange={handleChange}
          setPasswordToggle={setPasswordToggle}
          setAlert={setAlert}
          changeUserPassword={changeUserPassword}
        />
      }
      {deleteToggle && 
        <DeleteModule 
          current={current}
          handleChange={handleChange}
          setDeleteToggle={setDeleteToggle}
          setAlert={setAlert}
          deleteUser={deleteUser}
        />
      }
      {!editToggle && !passwordToggle && !deleteToggle && 
        <UserInfo
          current={current}
          setEditToggle={setEditToggle}
          setPasswordToggle={setPasswordToggle}
          setDeleteToggle={setDeleteToggle}
        />
      }
    </div>
  )
}

export default UserPage;