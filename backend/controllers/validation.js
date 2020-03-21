const { validationResult } = require('express-validator')

const checkValidation = (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).json({msg: errors.array()[0].msg})
  }
  next()
}

const validateGoalRequest = body => {
  const { name, duration, startDate, type, total } = body

  if (name === '') 
    return 'Please include a name for your goal.'
  if (duration === '') 
    return 'Please include a duration (in days) for your goal.'
  if (duration < 1) 
    return 'Duration must be at least one day.'
  if (startDate < Date.now())
    return 'Start date must not be in the past.'
  if (type !== 'pass/fail' && type !== 'total' && type !== 'difference') {
    return 'Please enter a valid type of goal.'
  }
  if (typeof total !== 'number' ) {
    if (type === 'pass/fail')
      return 'Please enter how often you want to hit your goal.'
    else if (type === 'total')
      return 'Please enter a total for your goal.'
    else
      return ('Please enter the difference you would like to achieve.')
  }
}

exports.checkValidation = checkValidation
exports.validateGoalRequest = validateGoalRequest