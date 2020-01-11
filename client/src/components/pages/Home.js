import React from 'react';
import Goals from '../goals/Goals';
//import Friends from '../friends/Friends';

const Home = () => {
  return (
    <div className='row'>
      <div className="col s6">
        <Goals/>
      </div>
      <div className="col s6">
        Friends
      </div>
    </div>
  )
};

export default Home;