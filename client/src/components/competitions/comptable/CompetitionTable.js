import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import GoalContext from '../../../contexts/goals/goalContext';
import CompetitionContext from '../../../contexts/competitions/competitionContext';
import GoalProgress from '../../goals/page/GoalProgress';
import CompInfo from './CompInfo';
import CompChart from './CompChart';
import AlertContext from '../../../contexts/alerts/alertContext';
import CompButtons from './CompButtons';

const CompetitionTable = ({isAdminView, isStarted, isActive, isComplete, time, competitionArray }) => {

  const { 
    goalCurrent, 
    updateGoalTracker,
    goalsError,
    clearGoalsError
  } = useContext(GoalContext);

  const { competition, getCompetitionGoals } = useContext(CompetitionContext);

  const { setAlert } = useContext(AlertContext);

  const { name, units, tracker, type, _id } = goalCurrent;

  const [record, setRecord] = useState(tracker);

  //fill missed past values in tracker array
  useEffect(() => {
    if (type === 'pass/fail') {
      setRecord(record.map((value, index) => {
        if (index < time && value === null) {
          value = false;
        }
        return value;
      }));
    }
    //eslint-disable-next-line
  }, []);

  //calc goal value of user
  let value = 0;
  if (type === 'difference') {
    let temp = record.filter(value => value !== null)
    value = temp.pop() - record[0];
  } else if (type === 'total') {
    for (let i = 0; i < record.length; i++ ) {
      value += record[i];
    }
  } else if (type === 'pass/fail') {
    for (let i = 0; i < record.length; i++ ) {
      if (record[i] === true) 
        value++;
    }
  }

  //handleSave - passed down to goal containers
  const handleSave = async (record) => {
    await updateGoalTracker(record, _id);
    if (goalsError) {
      setAlert(goalsError);
      clearGoalsError();
    }
    else {
      setAlert('Goal saved!');
      getCompetitionGoals(competition._id);
    }
  }

  let isOwner = true;

  return (
    <div className='competition-table-container'>
      {!Object.entries(competition).length ? (
        <h2>Loading...</h2>
      ) : (
        <React.Fragment>
          <h2 className='collection-header'>{name}</h2>
          <ul>
            {isStarted && 
              <CompChart 
                goal={goalCurrent}
                time={time}
                competitionArray={competitionArray}
              />
            }
            {isStarted && !isComplete &&
              <GoalProgress 
                type={type}
                time={time}
                record={record}
                setRecord={setRecord}
                units={units}
              />
            }
            <CompInfo 
              goal={goalCurrent}
              record={record}
              time={time}
              value={value}
              isStarted={isStarted}
            />
          </ul>
          <CompButtons 
            isAdminView={isAdminView}
            isOwner={isOwner}
            isStarted={isStarted}
            isActive={isActive}
            handleSave={handleSave}
            record={record}
          />        
        </React.Fragment>
      )}
    </div>
  )
}

CompetitionTable.propTypes = {
  isAdminView: PropTypes.bool.isRequired,
  isStarted: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  isComplete: PropTypes.bool.isRequired,
  time: PropTypes.number.isRequired,
  competitionArray: PropTypes.array.isRequired
}

export default CompetitionTable;