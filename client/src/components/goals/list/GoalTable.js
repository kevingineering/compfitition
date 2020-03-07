import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import GoalList from './GoalList';

const GoalTable = ({goals, isPast, isGoal, isOwner, name, loading}) => {

  console.log('GoalTable')
  
  const [isOpen, setIsOpen] = useState(true);

  const owner = name ? name + "'s " : null;
  const status = isPast ? 'Past ' : 'Current ';
  const type = isGoal ? 'Goal' : 'Competition';

  return (
    <React.Fragment>
      {(!isPast || goals.length !== 0) &&
        <ul className='collection'>
          <li className='collection-header header-with-btn'>
            <h2>{owner}{status}{type}s</h2>
            <button 
              className='btn btn-primary right'
              onClick={() => setIsOpen(prevState => !prevState)}
            >
              <i className={isOpen ? 'fas fa-minus' : 'fas fa-plus'}/>
            </button>
          </li>
          {isOpen &&
            <React.Fragment>
              <GoalList 
                goals={goals} 
                isOwner={isOwner} 
                isGoal={isGoal} 
                loading={loading}
              />
              {!isPast && isOwner &&
                <li className='collection-footer'>
                  <Link 
                    to={isGoal ? '/goalform' : '/competitionform'} 
                    className='text-secondary'
                  >
                    <p className='padding-025'>
                      <i className='fas fa-plus'/> Add {type}
                    </p>
                  </Link>
                </li>
              }
            </React.Fragment>
          }
        </ul>
      }
    </React.Fragment>
  )
}

GoalTable.propTypes = {
  goals: PropTypes.array.isRequired,
  isPast: PropTypes.bool.isRequired,
  isGoal: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
  name: PropTypes.string,
  loading: PropTypes.bool.isRequired
}

export default GoalTable;