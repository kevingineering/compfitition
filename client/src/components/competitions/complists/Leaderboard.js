import React from 'react';
import PropTypes from 'prop-types';
import LeaderboardItem from './LeaderboardItem';

const Leaderboard = ({competitionArray, type}) => {

  console.log('Leaderboard')

  let leaderboardList = (
    <li className='collection-item center collection-item-block'>
      Loading...
    </li>
  );
  
  if(competitionArray.length !== 0) {
    leaderboardList = (
      competitionArray.map((goal, index) => {
        return <LeaderboardItem name={goal[0]} count={goal[1]} type={type} key={index} />
      })
    );
  }

  return (
    <div className='competition-lists-container'>
      <ul className='collection'>
        <li className='collection-header'>
          <h3>Leaderboard</h3>
        </li>
        {leaderboardList}
        <hr/>
      </ul>
    </div>
  );
};

Leaderboard.propTypes = {
  competitionArray: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired
}

export default Leaderboard;