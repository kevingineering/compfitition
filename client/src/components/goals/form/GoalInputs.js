import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Input from '../../formComponents/Input';
import Switch from '../../formComponents/Switch';

const GoalInputs = ({message, goal, handleSubmit, handleChange, handleClick}) => {

  const { name, duration, startDate, type, units, total, isPrivate, initialValue, started } = goal;

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
              <option value='pass/fail'>
                Pass/Fail (e.g. Stretch every day)
              </option>
              <option value='total'>
                Total (e.g. Run 100 miles)
              </option>
              <option value='difference'>
                Difference (e.g. Gain 10 lbs)
              </option>
            </select>  
          </label>
        </div>
        {/* Total */}
        <div className="form-group">
          {type === 'pass/fail' && (
            <React.Fragment>
              <label>
                How many days a week do you want to hit your goal?
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

GoalInputs.propTypes = {
  message: PropTypes.string.isRequired,
  goal: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default GoalInputs;