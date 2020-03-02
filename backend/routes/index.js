const app = module.exports = require('express')();

//routes for HTTP functions
//note that .use() takes all paths that start with '/api/goals', whereas .get(), .post(), etc work with only exact paths
//note also that functions are not called when the server starts, but are stored as callback functions that run when requests get sent
app.use('/api/goals', require('./goals'));
app.use('/api/users', require('./users'));
app.use('/api/requests', require('./requests'));
app.use('/api/friends', require('./friends'));
app.use('/api/competitions', require('./competitions'));
app.use('/api/letters', require('./letters'));

// //error handler for unsupported routes
// app.use((req, res) => {
//   return res.status(404).json({msg: 'This route could not be found.'})
// })

//error handler response
app.use((error, req, res, next) => {
  //check whether or not a response has already been sent
  if (res.headerSent) {
    return next(error);
  }
  //take status code set by middleware or 500 as default
  res.status(error.code || 500);
  //return message that client can use to show user
  res.json({msg: error.message || 'An unknown error occured.'});
});