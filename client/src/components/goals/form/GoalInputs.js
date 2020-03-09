import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Input from '../../formComponents/Input';
import Select from '../../formComponents/Select';
import Switch from '../../formComponents/Switch';

const GoalInputs = ({message, goal, handleSubmit, handleChange, handleClick}) => {

 //console.log{'GoalInputs')

  const { name, duration, startDate, type, description, units, total, isPrivate, initialValue, started } = goal;

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
        {/* Goal Description */}
        <Input
          label='Goal Description (optional)'
          type='textarea'
          value={description}
          name='description'
          handleChange={handleChange}
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
          min='1'
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
        <Select 
          label='What type of goal would you like?'
          name='type'
          value={type}
          handleChange={handleChange}
          disabled={started}
          options={[
            {value: 'pass/fail', text: 'Pass/Fail (e.g. Drink 8+ cups of water)'},
            {value: 'total', text: 'Total (e.g. Run 100 miles)'},
            {value: 'difference', text: 'Difference (e.g. Gain 10 lbs)'}
          ]}
        />
        {/* Total */}
        <div className="form-group">
          {type === 'pass/fail' && (
            <Select 
              label='How many days per week do you want to hit your goal?'
              name='total'
              value={total}
              handleChange={handleChange}
              disabled={started}
              options={[
                {value: '7', text: 'Every day'},
                {value: '6', text: 'Six days a week'},
                {value: '5', text: 'Five days a week'},
                {value: '4', text: 'Four days a week'},
                {value: '3', text: 'Three days a week'},
                {value: '2', text: 'Two days a week'},
                {value: '1', text: 'One day a week'},
              ]}
            />
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
                disabled={started}
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
            label='Units (e.g. lbs or miles)'
            type='text'
            value={units}
            name='units'vl
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