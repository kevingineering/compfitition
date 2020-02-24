import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import GoalContext from '../../contexts/goals/goalContext';
import AlertContext from '../../contexts/alerts/alertContext';
import Input from '../formComponents/Input';
import Switch from '../formComponents/Switch';

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

  //on start, populate current if updating goal
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
        <Input
          label='Goal Name'
          type='text'
          value={name}
          name='name'
          handleChange={handleChange}
          autoFocus={true}
        />
        {/* Start Date */}
        <Input
          label='Start Date'
          type='date'
          value={started ? 
            moment.utc(startDate).format('YYYY-MM-DD') : 
            moment(startDate).format('YYYY-MM-DD')}
          name='startDate'
          handleChange={handleChange}
          disabled={started}
        />
        {/* Duration */}
        <Input
          label='Goal Duration (days)'
          type='number'
          value={duration}
          name='duration'
          handleChange={handleChange}
          min='0'
          max='3654'
          warning={(
              type === 'pass/fail' && 
              !(Number.isInteger(duration / 7)) && 
              (duration !== '')
            ) ? (
            <span className='block small-text'>
              *Goal duration will be adjusted to {duration - (duration % 7) + 7} days to use full weeks.
            </span>
            ) : null
          }
        />          
        {/* Type */}
        <div className="form-group">
          <label>What type of goal would you like?
            <select
              disabled={started}
              name='type'
              value={type}
              onChange={handleChange}
            >
              <option value='pass/fail'>Pass/Fail (e.g. Stretch every day)</option>
              <option value='total'>Total (e.g. Run 100 miles)</option>
              <option value='difference'>Difference (e.g. Gain 10 lbs)</option>
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
          {type === 'total' && 
            <Input
              label='What total number do you want to hit?'
              type='number'
              value={total}
              name='total'
              handleChange={handleChange}
              min='0'
              max='1000000'
            />
          }
          {type === 'difference' && (
            <React.Fragment>
              <Input
                label='What is your start number?'
                type='number'
                value={initialValue}
                name='initialValue'
                handleChange={handleChange}
                min='0'
                max='1000000'
              />
              <Input
                label='What number do you want to achieve?'
                type='number'
                value={total}
                name='total'
                handleChange={handleChange}
                min='0'
                max='1000000'
              />
            </React.Fragment>
          )}
        </div>
        {/* Units */}
        {type !== 'pass/fail' && (
          <Input
            label='Units (e.g lbs or miles)'
            type='text'
            value={units}
            name='units'
            handleChange={handleChange}
          />
        )}
        {/* isPrivate */}
        <Switch 
          label='Who can see this goal?'
          isChecked={!isPrivate}
          name='isPrivate'
          handleClick={handleClick}
          msgChecked='Only I can see this goal.'
          msgBlank='My friends can see this goal.'
        />
        {/* Submit */}
        <input 
          type='submit' 
          value={message} 
        />
      </form>
    </div>
  );
};

export default GoalForm;