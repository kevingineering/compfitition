import React from 'react';
import Goals from '../goals/Goals';
//import Friends from '../friends/Friends';

const Home = () => {
  return (
    <div className='grid-2'>
      <div>
        <Goals/>
      </div>
      <div>
        Friends
      </div>
    </div>
  )
};

export default Home;