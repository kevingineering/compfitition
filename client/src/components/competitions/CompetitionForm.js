import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import GoalContext from '../../contexts/goals/goalContext';
import CompetitionContext from '../../contexts/competitions/competitionContext';
import AlertContext from '../../contexts/alerts/alertContext';

const CompetitionForm = () => {

  console.log('CompetitionForm')

  const goalContext = useContext(GoalContext);
  const { addGoal, goalCurrent, setCurrentGoal, getGoals } = goalContext;

  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlert } = alertContext;

  const competitionContext = useContext(CompetitionContext);
  const { addCompetition, updateCompetition, competition } = competitionContext;

  //started determines if goal has begun, initialValue is used with difference goals 
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
  
  //runs necessary functions before redirect
  const [isSubmit, setIsSubmit] = useState(false);

  //helps update competition with useEffect
  const [isUpdate, setIsUpdate] = useState(false);

  //on start, control if adding or updating competition
  useEffect(() => {
    if (Object.entries(goalCurrent).length) {
      setIsUpdate(true);
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
        setAlert('This competition has already begun, so some attributes cannot be changed.')
      }
    }
    //eslint-disable-next-line
  }, [])

  //if adding, create competition, clear alert, and redirect
  //if updating, get goals, set updated goal as current, clear alert, and redirect
  let history = useHistory();
  useEffect(() => {
    if (isSubmit && !isUpdate) {
      let temp = async () => {
        await addCompetition(goalCurrent._id);
        clearAlert();
        history.push('/competition');
      }
      temp();
    }
    else if (isSubmit && isUpdate) {
      let temp = async () => {
        await getGoals();
        setCurrentGoal(goalCurrent._id);
        clearAlert();
        history.push('/competition');
      }
      temp();
    }
    //eslint-disable-next-line
  }, [isSubmit, isUpdate])
  
  //destructure goal 
  const { name, duration, startDate, type, description, units, total, isPrivate, initialValue, started } = goal;
  
  //add or update competition
  const handleSubmit = async e => {
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

    //try to submit 
    if(name && duration && startDate && type && total && (units || type === 'pass/fail')) {
      //add/update competition and tell user
      if (message === 'Modify Competition') {
        await updateCompetition({goal, _id: competition._id});
        setAlert('Competition updated!', true);
      } else {
        await addGoal(goal);
        setAlert('Competition added!', true);
      }
      setIsSubmit(true);
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

  const handleSlider = () => {
    if (total === -1)
      setGoal({ ...goal, total: 7})
    else
      setGoal({ ...goal, total: -1})
  }
  
  const message = Object.entries(goalCurrent).length ? 'Modify Competition' : 'Add Competition';

  return (
    <div className='form-container'>
      <h1>{message}</h1>
      <form onSubmit={handleSubmit} autoComplete='off'>
        {/* Name */}
        <div className="form-group">
          <label>Competition Name</label>
          <input 
            type='text' 
            name='name' 
            onChange={handleChange}
            value={name}
            autoFocus={true}
          />
        </div>
        {/* Description */}
        <div className="form-group">
          <label>Competition Description (Optional)</label>
          <input 
            type='text' 
            name='description' 
            onChange={handleChange}
            value={description}
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
          <label>Competition Duration (days)</label>
          <input 
            type='number' 
            name='duration' 
            onChange={handleChange}
            value={duration}
            min='1'
            max='3654'
          />
          {type === 'pass/fail' && !(Number.isInteger(duration / 7)) && (duration !== '') &&
            <span className='block small-text'>*Competition duration will be adjusted to {duration - (duration % 7) + 7} days to use full weeks.</span>
          }
        </div>
        {/* Type */}
        <div className="form-group">
          <label>What type of competition would you like?
            <select
              disabled={started}
              name='type'
              value={type}
              onChange={handleChange}
            >
              <option value='pass/fail'>Pass/Fail  (e.g. Miss class the least)</option>
              <option value='total'>Total  (e.g. Run the most miles)</option>
              <option value='difference'>Difference  (e.g. Lose the most weight)</option>
            </select>  
          </label>
        </div>
        {/* Total */}
        <div className="form-group">
          {type === 'pass/fail' && (
            <React.Fragment>
              <label>
                How many days a week do you want participants to hit?
              </label>
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
          {type === 'difference' && (
            <React.Fragment>
              <label>What is your (personal) start number?</label>
              <input 
                disabled={started}
                type='number' 
                name='initialValue' 
                onChange={handleChange}
                value={initialValue}
                min='0'
                max='1000000'
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
            Who can see this competition?
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
            {isPrivate ? 'Only participants can see this competition.' : 'Friends of participants can see this competition.'}
          </span>
        </div>
        {/* Total */}
        {type !== 'pass/fail' && 
          <div className="form-group">
            <label className='block'>
              How is this competition decided?
            </label>
            <label className='switch'>
              <input
                type='checkbox'
                checked={total === -1}
                onChange={handleSlider}
              />
              <span className='slider round'/>
            </label>
            <span className='register-span'>
              This competition is won by the user with the
              {type === 'total' && 
                ((total !== -1 ? ' highest ' : ' lowest ') + `total ${units}.`)} 
              {type === 'difference' && 
                (' biggest ' + (total !== -1 ? 'positive ' : 'negative ') + 'change.')}
            </span>
          </div>
        }
        {/* Submit */}
        <input 
          type='submit' 
          value={message} 
        />
      </form>
    </div>
  );
};

export default CompetitionForm;