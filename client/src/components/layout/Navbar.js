import React, { useContext } from 'react';
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

  const handleLogout = () => {
    logoutUser();
    clearGoals();
    clearFriends();
    clearRequests();
  };

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
  
  if (isAuthenticated && user) {
    links = (
      <React.Fragment>
        <li>
          <p>Hello,<Link to={'/user'} style={{margin: 0}}>{user.alias !== '' ? user.alias : user.firstName}!</Link></p>
        </li>
        <li>
          <a href='#!' onClick={handleLogout}>
            <span className="hide-sm">Log Out </span>
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
        {links}
      </ul>
    </nav>
  );
};

export default Navbar;