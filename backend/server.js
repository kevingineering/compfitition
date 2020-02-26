const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

//initialize express object 
const app = express();

//connect to DB
connectDB();

//adds json body parser to our express object - calls next for us, so we move to next middleware after request body is parsed, automatically creates and populates req.body
app.use(express.json({ extended: false }));

//routes for HTTP functions - first argument is path, second argument is function that gets called - note that .use() takes all paths that start with '/api/goals', whereas .get(), .post(), etc work with only exact paths
//note also that .use(), .get(), etc functions are not called when the server starts, but are stored as callback functions that run when requests get sent
app.use('/api/goals', require('./routes/goals'));
app.use('/api/users', require('./routes/users'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/competitions', require('./routes/competitions'));
app.use('/api/letters', require('./routes/letters'));

//error handler for unsupported routes
app.use((req, res) => {
  return res.status(404).json({msg: 'This route could not be found.'})
})

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

//serve static assets (build folder) if in production
if (process.env.NODE_ENV === 'production') {
  //sets static folder to build folder
  app.use(express.static('cliend/build'));
  //returns index.html for routes not handled above
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

//environmental port (if deployed) or local port 5004
const port = process.env.PORT || 5004;

//start server
app.listen(port, () => console.log(`Server started on port ${port}`));