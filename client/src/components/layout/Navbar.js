import React from 'react';
import { Link } from 'react-router-dom';
import CompFITition from '../resources/CompFITition.png';

const Navbar = () => {
  return (
    <nav>
      <div className="nav-wrapper indigo">
        <Link to='/' className='brand-logo'>
          <img src={CompFITition} alt="CompFITition"/>
        </Link>
        <ul id='nav-mobile' className='right hide-on-med-and-down'>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
          <li>
            <Link to='/'>Hello, User</Link>
          </li>
          <li>
            <Link to='/'>Log out</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
};

export default Navbar;