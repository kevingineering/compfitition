import React, { useState, useContext, useEffect } from 'react';
import GoalContext from '../../contexts/goals/goalContext';
import AlertContext from '../../contexts/alerts/alertContext';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

const GoalForm = () => {
  const goalContext = useContext(GoalContext);
  const { addGoal, updateGoal, goalCurrent } = goalContext;

  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlert } = alertContext;

  //started determines if goal has begun, initialValue is used with difference goals 
  const [goal, setGoal] = useState({
    name: '',
    duration: 28,
    startDate: moment().startOf('day').format('YYYY-MM-DD'),
    type: 'pass/fail',
    units: '',
    total: 7,
    isPrivate: false,
    compId: null,
    initialValue: 0,
    started: false
  });

  //tells when to redirect to new goal page
  const [isRedirect, setIsRedirect] = useState(false);

  //on start, control if adding or updating goal
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
          started: true,
          initialValue: goalCurrent.tracker[0] 
        })
        setAlert('This goal has already begun, so some attributes cannot be changed.');
      }
    }
    //eslint-disable-next-line
  }, [])

  //redirect
  let history = useHistory();
  useEffect(() => {
    if (isRedirect)
      history.push('/goal');
    //eslint-disable-next-line
  }, [isRedirect])

  //on unmount, clear nonpersistant alert
  useEffect(() => {
    return () => {
      clearAlert();
    }
    //eslint-disable-next-line
  }, [])
  
  const { name, duration, startDate, type, units, total, isPrivate, initialValue, started } = goal;
  
  //add or update goal
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    //verify dates
    let time = moment.utc().startOf('day').diff(startDate, 'days');
    //verify start date not in past
    if(time > 0 && !started) {
      setAlert('Start date cannot be in the past.');
      return null;
    }
    //verify finish date is not in past (for goals that have started)
    if(duration - time < 0){
      setAlert('Finish date cannot be in the past.');
      return null;
    }

    //try to submit goal
    if(name && duration && startDate && type && total && (units || type === 'pass/fail')) {
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
      setAlert('Please enter all fields.');
  };

  //update state with inputs
  const handleChange = e => {
    if (e.target.name === 'duration' || e.target.name === 'total' || e.target.name === 'initialValue') {
      if (e.target.value === '') 
        setGoal({ ...goal, [e.target.name]: ''});
      else 
        setGoal({ ...goal, [e.target.name]: parseInt(e.target.value)});
    }
    else if (e.target.name === 'type' && e.target.value === 'pass/fail')
      setGoal({ ...goal, total: 7, type: 'pass/fail' });
    else
      setGoal({
        ...goal, 
        [e.target.name]: e.target.value
      });
  };

  //update isPrivate state with input
  const handleClick = e => {
    setGoal({ ...goal, isPrivate: !isPrivate });
  };

  const message = Object.entries(goalCurrent).length ? 'Modify Goal' : 'Add Goal';

  return (
    <div className='form-container'>
      <h1>{message}</h1>
      <form onSubmit={handleSubmit} autoComplete='off'>
        {/* Name */}
        <div className="form-group">
          <label>Goal Name</label>
          <input 
            type='text' 
            name='name' 
            onChange={handleChange}
            value={name}
            autoFocus={true}
          />
        </div>
        {/* Start Date */}
        <div className="form-group">
          <label>Start Date</label>
          <input 
            disabled={started}
            type='date' 
            name='startDate' 
            onChange={handleChange}
            value={started ? moment.utc(startDate).format('YYYY-MM-DD') : moment(startDate).format('YYYY-MM-DD')}
          />
        </div>
        {/* Duration */}
        <div className="form-group">
          <label>Goal Duration (days)</label>
          <input 
            type='number' 
            name='duration' 
            onChange={handleChange}
            value={duration}
          />
          {type === 'pass/fail' && !(Number.isInteger(duration / 7)) && (duration !== '') &&
            <span className='block small-text'>*Goal duration will be adjusted to {duration - (duration % 7) + 7} days to use full weeks.</span>
          }
        </div>
        {/* Type */}
        <div className="form-group">
          <label>What type of goal would you like?
            <select
              disabled={started}
              name='type'
              value={type}
              onChange={handleChange}
            >
              <option value='pass/fail'>Pass/Fail  (e.g. Stretch every day)</option>
              <option value='total'>Total  (e.g. Run 100 miles)</option>
              <option value='difference'>Difference  (e.g. Gain 10 lbs)</option>
            </select>  
          </label>
        </div>
        {/* Total */}
        <div className="form-group">
          {type === 'pass/fail' && (
            <React.Fragment>
              <label>How many days a week do you want to hit your goal?</label>
              <select
                disabled={started}
                name='total'
                value={total}
                onChange={handleChange}
              >
                <option value='7'>Every day</option>
                <option value='6'>Six days a week</option>
                <option value='5'>Five days a week</option>
                <option value='4'>Four days a week</option>
                <option value='3'>Three days a week</option>
                <option value='2'>Twice a week</option>
                <option value='1'>Once a week</option>
              </select>  
            </React.Fragment>
          )}
          {type === 'total' && (
            <React.Fragment>
              <label>What total number do you want to hit?</label>
              <input 
                type='number' 
                name='total' 
                onChange={handleChange}
                value={total}
                min='0'
              />
            </React.Fragment>
          )}
          {type === 'difference' && (
            <React.Fragment>
              <label>What is your start number?</label>
              <input 
                disabled={started}
                type='number' 
                name='initialValue' 
                onChange={handleChange}
                value={initialValue}
                min='0'
              />
              <label>What number do you want to achieve?</label>
              <input 
                type='number' 
                name='total' 
                onChange={handleChange}
                value={total}
                min='0'
              />
            </React.Fragment>
          )}
        </div>
        {/* Units */}
        {type !== 'pass/fail' && (
          <div className="form-group">
            <label>Units (e.g lbs or miles)</label>
            <input 
              type='text' 
              name='units' 
              onChange={handleChange}
              value={units}
            />
          </div> 
        )}
        {/* isPrivate */}
        <div className="form-group">
          <label className='block'>
            Who can see this goal?
          </label>
          <label className='switch'>
            <input
              type='checkbox'
              checked={!isPrivate}
              onChange={handleClick}
            />
            <span className='slider round'/>
          </label>
          <span className='register-span'>
            {isPrivate ? 'Only I can see this goal.' : 'My friends can see this goal.'}
          </span>
        </div>
        {/* Submit */}
        <input 
          type='submit' 
          value={message} 
          className='btn btn-block btn-primary'
        />
      </form>
    </div>
  );
};

export default GoalForm;