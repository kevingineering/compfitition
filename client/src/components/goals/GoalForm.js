import React, { useState, useContext, useEffect } from 'react';
import GoalContext from '../../contexts/goals/goalContext';
import AlertContext from '../../contexts/alerts/alertContext';
import moment from 'moment';

const GoalForm = props => {
  const goalContext = useContext(GoalContext);
  const { addGoal, updateGoal, current } = goalContext;

  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlerts } = alertContext;

  const [goal, setGoal] = useState({
    name: '',
    duration: 90,
    startDate: moment().format('YYYY-MM-DD'),
    type: 'pass/fail',
    units: '',
    total: 7,
    privacy: 'only me',
    sign: true
  });

  //control if current or not
  useEffect(() => {
    if (Object.entries(current).length) {
      setGoal({ ...current, sign: (total >= 0), startDate: moment(current.startDate).format('YYYY-MM-DD') });
    }
      //eslint-disable-next-line
  }, [])

  const message = Object.entries(current).length ? 'Modify Goal' : 'Add Goal';

  const { name, duration, startDate, type, units, total, privacy, sign } = goal;

  const handleSubmit = e => {
    e.preventDefault();
    clearAlerts();
    //set sign on type 'difference'
    if(!sign)
      setGoal({ ...goal, total: total * -1 })
    if(name && duration && startDate && type && total && (units || type === 'pass/fail')) {
      //add/update goal and tell user
      if (message === 'Modify Goal') {
        updateGoal(goal);
        setAlert('Goal updated!');
      } else {
        addGoal(goal);
        setAlert('Goal added!');
      }
      
      //clear state
      setGoal({
        name: '',
        duration: 90,
        startDate: Date.now(),
        type: 'pass/fail',
        units: '',
        total: 7,
        privacy: 'only me'
      });
      
      //redirect to homepage and clear alerts
      props.history.push('/');
      setTimeout(() => {
        clearAlerts();
      }, 2000);
    }
    else 
      setAlert('Please enter all fields.');
  };

  const handleClick = e => {
    e.preventDefault();
    setGoal({ ...goal, sign: !sign });
  };

  const handleChange = e => {
    if (e.target.name === 'duration' || e.target.name === 'total')
      setGoal({
        ...goal,
        [e.target.name]: parseInt(e.target.value)
      })
    else
      setGoal({
        ...goal, 
        [e.target.name]: e.target.value
      });
  };

  return (
    <div className='form-container'>
      <h1>{message}</h1>
      <form onSubmit={handleSubmit}>
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
            type='date' 
            name='startDate' 
            onChange={handleChange}
            value={startDate}
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
        </div>
        {/* Type */}
        <div className="form-group">
          <label>What type of goal would you like?
            <select
              name='type'
              value={type}
              onChange={handleChange}>
              <option value='pass/fail'>Pass/Fail  (e.g. I went to the gym today)</option>
              <option value='total'>Total  (e.g. I ran three miles today)</option>
              <option value='difference'>Difference  (e.g. I lost three pounds this month)</option>
            </select>  
          </label>
        </div>
        {/* Total / Sign */}
        <div className="form-group">
          {type === 'pass/fail' && (
            <React.Fragment>
              <label>How often do you want to hit your goal?</label>
              <select
                name='total'
                value={total}
                onChange={handleChange}>
                <option value='7'>Daily</option>
                <option value='6'>Six days a week</option>
                <option value='5'>Five days a week</option>
                <option value='4'>Four days a week</option>
                <option value='3'>Three days a week</option>
                <option value='2'>Twice a week</option>
                <option value='1'>Once a week</option>
                <option value='30'>Once a month</option>
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
              <label className='block'>What difference do you want to achieve?</label>
              <button
                type='button'
                onClick={handleClick}
                className='btn-square btn-primary'
              >
              <i className={sign ? 'fas fa-plus' : 'fas fa-minus' } />
              </button>
              <input 
                type='number' 
                name='total' 
                onChange={handleChange}
                value={total}
                id='input-special'
              />
            </React.Fragment>
          )}
        </div>
        {/* Privacy */}
        <div className="form-group">
          <label>Who can see your goal?
            <select
              name='privacy'
              value={privacy}
              onChange={handleChange}>
              <option value='only me'>Only Me</option>
              <option value='friends'>My Friends</option>
              <option value='public'>Everyone</option>
            </select>  
          </label>
        </div>
        {/* Units */}
        {type !== 'pass/fail' && (
          <div className="form-group">
            <label>Units (e.g lbs or miles)</label>
            <input 
              type='text' 
              name='units' 
              placeholder='Units (Example: miles)' 
              onChange={handleChange}
              value={units}
            />
          </div> 
        )}
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