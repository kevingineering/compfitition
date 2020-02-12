//Validates credentials for private routes

const config = require('config');
const jwt = require('jsonwebtoken');

//create middleware function
module.exports = (req, res, next) => {
  //fetches token from request header
  const token = req.header('x-auth-token');
  //check for token
  if (!token) return res.status(401).json({msg: 'No token, authorization denied.'});

  try {
    //verify token
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    //add user from payload
    req.user = decoded.user;
    //calls next middleware - if we don't use next, no more middleware functions will be run, so call next(); unless you want to send a response
    next();
  } catch (err) {
    res.status(400).json({msg: 'Invalid token.'});
  };
};