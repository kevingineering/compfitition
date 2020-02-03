const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

//initialize express
const app = express();

//connect to DB
connectDB();

//body parser middleware
app.use(express.json({ extended: false }));

//routes
app.use('/api/goals', require('./routes/goals'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/friends', require('./routes/friends'));
//competitions

//environmental port (if deployed) or local port 5004
const port = process.env.PORT || 5004;

//start server
app.listen(port, () => console.log(`Server started on port ${port}`));