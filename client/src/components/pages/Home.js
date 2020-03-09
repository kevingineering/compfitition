import React from 'react';
import Goals from '../goals/list/Goals';
import Friends from '../friends/user/Friends';
import Notifications from '../letters/Notifications';

const Home = () => {

 //console.log{'Home')
  
  return (
    <div className='grid-2'>
      <Goals/>
      <div>
        <Notifications/>
        <Friends/>
      </div>
    </div>
  )
};

export default Home;