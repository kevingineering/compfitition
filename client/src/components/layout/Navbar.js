import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import GoalContext from '../../contexts/goals/goalContext';
import FriendContext from '../../contexts/friends/friendContext';
import RequestContext from '../../contexts/requests/requestContext';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user, logoutUser } = authContext;

  const goalContext = useContext(GoalContext);
  const { clearGoals } = goalContext;
  
  const friendContext = useContext(FriendContext);
  const { clearFriends } = friendContext;

  const requestContext = useContext(RequestContext);
  const { clearRequests } = requestContext;

  const [isNightTheme, setIsNightTheme] = useState(false);

  const handleLogout = () => {
    logoutUser();
    clearGoals();
    clearFriends();
    clearRequests();
  };

  //logic for changing themes
  const changeTheme = (status) => {
    if(status) {
      document.documentElement.style.setProperty('--primary-color', '#999999')
      document.documentElement.style.setProperty('--secondary-color', '#181818')
      document.documentElement.style.setProperty('--danger-color', '#8B0000')
      document.documentElement.style.setProperty('--success-color', '#006400')
      document.documentElement.style.setProperty('--current-color', '#BE9313')
      document.documentElement.style.setProperty('--tooltip-color', '#999999')
     } else {
      document.documentElement.style.setProperty('--primary-color', '#000000')
      document.documentElement.style.setProperty('--secondary-color', '#FFFFFF')
      document.documentElement.style.setProperty('--danger-color', '#FF0000')
      document.documentElement.style.setProperty('--success-color', '#008000')
      document.documentElement.style.setProperty('--current-color', '#FFFF00')
      document.documentElement.style.setProperty('--tooltip-color', '#FFFFFF')
     }
  }

  //handles toggle clicked
  const handleToggle = () => {
    setIsNightTheme(prevState => !prevState)
    changeTheme(!isNightTheme);
  }

  //button for light/dark theme
  let themeToggle = (
    <li>
      <button 
        className='btn btn-primary right padding-070'
        onClick={handleToggle}
      >
        <i className={isNightTheme ? 'fas fa-moon' : 'fas fa-sun'}/>
      </button>
    </li>
  )

  //signed out links
  let links = (
    <React.Fragment>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Log In</Link>
      </li>
    </React.Fragment>
  );
  
  //signed in links
  if (isAuthenticated && user) {
    links = (
      <React.Fragment>
        <li>
          <p>
            Hello,
            <Link to={'/user'} className='margin-0'>
              {user.alias !== '' ? user.alias : user.firstName}!
            </Link>
          </p>
        </li>
        <li>
          <a href='#!' onClick={handleLogout}>
            <span className="hide-sm text-secondary">Log Out </span>
            <i className='fas fa-sign-out-alt' />
          </a>
        </li>
      </React.Fragment>
    );
  }

  return (
    <nav className='navbar bg-primary'>
      <h1>
        <Link to='/'><i className='fas fa-medal'/> CompFITition</Link>
      </h1>
      <ul>
        {themeToggle}
        {links}
      </ul>
    </nav>
  );
};

export default Navbar;