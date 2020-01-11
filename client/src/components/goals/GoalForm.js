import React, { useState, useContext } from 'react';
import GoalContext from '../../contexts/goals/goalContext';

const GoalForm = () => {
  const [goal, setGoal] = useState({
    name: '',
    duration: '',
    parent: 'dummy',
    startDate: ''
  });
  const {name, duration, parent, startDate} = goal;

  const goalContext = useContext(GoalContext);
  const { addGoal } = goalContext;

  const handleSubmit = e => {
    e.preventDefault();
    if(name && duration && parent && startDate)
      addGoal(goal);
      setGoal({
        name: '',
        duration: '',
        parent: 'dummy',
        startDate: ''
      });
    //else
      //show alert
  };

  const handleChange = e => {
    setGoal({
      ...goal, 
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h1>Add Goal</h1>
      <form onSubmit={e => handleSubmit(e)}>
        <input 
          type='text' 
          name='name' 
          placeholder='Goal Name' 
          onChange={handleChange}
          value={name}
        />
        <input 
          type='number' 
          name='duration' 
          placeholder='Duration (days)' 
          onChange={handleChange}
          value={duration}
        />
        <input 
          type='date' 
          name='startDate' 
          placeholder='Start Date' 
          onChange={handleChange}
          value={startDate}
        />
        <input 
          type='submit' 
          value='Add Goal' 
        />
      </form>
    </div>
  )
}

export default GoalForm;