const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

//initialize express
const app = express();

//body parser middleware
app.use(express.json({ extended: false }));

//routes
app.use('/api/goals', require('./routes/goals'));

//environmental port (if deployed) or local port 5000
const port = process.env.PORT || 5000;

//start server
app.listen(port, () => console.log(`Server started on port ${port}`));