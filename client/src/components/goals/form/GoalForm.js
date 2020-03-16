import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import GoalContext from '../../../contexts/goals/goalContext';
import AlertContext from '../../../contexts/alerts/alertContext';
import GoalInputs from './GoalInputs';
import { verifyDates, handleGoalChange } from '../../sharedFunctions';

const GoalForm = () => {

 //console.log{'Goal')

  const goalContext = useContext(GoalContext);
  const { addGoal, updateGoal, goalCurrent } = goalContext;

  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlert } = alertContext;

  //started determines if goal has begun
  //initialValue is used with difference goals 
  const [goal, setGoal] = useState({
    name: '',
    duration: 28,
    startDate: moment().startOf('day').format('YYYY-MM-DD'),
    type: 'pass/fail',
    description: '',
    units: '',
    total: 7,
    isPrivate: false,
    compId: null,
    initialValue: 0,
    started: false
  });

  //on start, populate goal with currentGoal if updating goal
  useEffect(() => {
    if (Object.entries(goalCurrent).length) {
      setGoal({ 
        ...goalCurrent, 
        startDate: moment.utc(goalCurrent.startDate).startOf('day'),
        initialValue: goalCurrent.tracker[0]
      });
      if (moment(goalCurrent.startDate).startOf('day') < moment.utc().startOf('day')) {
        setGoal({
          ...goalCurrent, 
          started: true
        })
        setAlert('This goal has already begun, so some attributes cannot be changed.');
      }
    }
    //eslint-disable-next-line
  }, [])

  //tells when to redirect to new goal page
  const [isRedirect, setIsRedirect] = useState(false);

  //redirect
  let history = useHistory();
  useEffect(() => {
    if (isRedirect) {
      history.push('/goal');
    }
    //eslint-disable-next-line
  }, [isRedirect])

  //on unmount, clear nonpersistant alert
  useEffect(() => {
    return () => {
      clearAlert();
    }
    //eslint-disable-next-line
  }, [])
  
  const { name, duration, startDate, type, units, total, isPrivate, started } = goal;
  
  //add or update goal
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const msg = verifyDates(startDate, started, duration);

    //try to add goal
    if(!msg && name && duration && startDate && type && total && (units || type === 'pass/fail')) {
      //add/update goal and tell user
      if (message === 'Modify Goal') {
        await updateGoal(goal);
        setAlert('Goal updated!', true);
        setIsRedirect(true);
      } else {
        await addGoal(goal);
        setAlert('Goal added!', true);
        setIsRedirect(true);
      }
    }
    else 
      setAlert(msg || 'Please enter all fields.');
  };

  //update state with inputs
  const handleChange = e => {
    handleGoalChange(e, setGoal, goal);
  };
  
  //update isPrivate state with input
  const handleClick = e => {
    setGoal({ ...goal, isPrivate: !isPrivate });
  };

  const message = Object.entries(goalCurrent).length ? 'Modify Goal' : 'Add Goal';

  return (
    <GoalInputs 
      goal={goal}
      message={message}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleClick={handleClick}
      isGoal={true}
    />
  );
};

export default GoalForm;