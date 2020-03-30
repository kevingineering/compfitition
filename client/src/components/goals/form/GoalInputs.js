import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import Input from '../../formComponents/Input'
import Select from '../../formComponents/Select'
import Switch from '../../formComponents/Switch'

const GoalInputs = ({message, goal, handleSubmit, handleChange, handleClick, handleIsMax, isGoal}) => {

 //console.log{'GoalInputs')

  const options = isGoal ? [
    {value: 'pass/fail', text: 'Pass/Fail (e.g. Stretch every morning)'},
    {value: 'total', text: 'Total (e.g. Run 100 miles)'},
    {value: 'difference', text: 'Difference (e.g. Gain 10 lbs)'}
  ] : [
    {value: 'pass/fail', text: 'Pass/Fail (e.g. Stretch the most days)'},
    {value: 'total', text: 'Total (e.g. Run the most miles)'},
    {value: 'difference', text: 'Difference (e.g. Lose the most weight)'}
  ]

  const upperCase = isGoal ? 'Goal' : 'Competition'
  const lowerCase = isGoal ? 'goal' : 'competition'

  const { name, duration, startDate, type, description, units, total, isPrivate, initialValue, started } = goal

  return (
    <div className='form-container'>
      <h1>{message}</h1>
      <form onSubmit={handleSubmit} autoComplete='off'>
        {/* Name */}
        <Input
          label={`${upperCase} Name`}
          type='text'
          value={name}
          name='name'
          handleChange={handleChange}
          autoFocus={true}
        />
        {/* Description */}
        <Input
          label={`${upperCase} Description (optional)`}
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
          label={`${upperCase} Duration (days)`}
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
          label={`What type of ${lowerCase} would you like?`}
          name='type'
          value={type}
          handleChange={handleChange}
          disabled={started}
          options={options}
        />
        {/* Total */}
        <div className="form-group">
          {type === 'pass/fail' && (
            <Select 
              label={isGoal ? 
              'How many days per week do you want to hit your goal?' : 
              'How many days per week do you want participants to hit the goal?'}
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
          {type === 'total' && isGoal &&
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
                label={`What is your ${isGoal ? '' : '(personal) '}start number?`}
                type='number'
                value={initialValue}
                name='initialValue'
                handleChange={handleChange}
                min='0'
                max='1000000'
                disabled={started}
              />
              {isGoal &&
                <Input
                  label='What number do you want to achieve?'
                  type='number'
                  value={total}
                  name='total'
                  handleChange={handleChange}
                  min='0'
                  max='1000000'
                />
              }
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
          label={`Who can see this ${lowerCase}?`}
          isChecked={!isPrivate}
          name='isPrivate'
          handleClick={handleClick}
          msgChecked={isGoal ? 'My friends can see this goal.' : 'Friends of participants can see this competition.'}
          msgBlank={isGoal ? 'Only I can see this goal.' : 'Only participants can see this competition.'}
        />
        {/* High or low score wins */}
        {type !== 'pass/fail' && !isGoal && 
          <Switch 
            label='How is this competition decided?'
            isChecked={total !== -1}
            name='isPrivate'
            handleClick={handleIsMax}
            msgChecked={`This competition is won by the user with the 
              ${type === 'total' ? 
                `highest total ${units}.` : 
                'biggest positive change.'
              }`}
            msgBlank={`This competition is won by the user with the 
              ${type === 'total' ? 
                `lowest total ${units}.` : 
                'biggest negative change.'
              }`}
          />
        }
        {/* Submit */}
        <input 
          type='submit' 
          value={message} 
        />
      </form>
    </div>
  )
}

GoalInputs.propTypes = {
  message: PropTypes.string.isRequired,
  goal: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleIsMax: PropTypes.func,
}

export default GoalInputs