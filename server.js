const express = require('express')
const path = require('path')
const connectDB = require('./dbConnection')
const routes = require('./backend/routes/index')

//initialize express object 
const app = express()

//connect to DB
connectDB()

//adds json body parser to our express object - calls next for us, so we move to next middleware after request body is parsed, automatically creates and populates req.body
app.use(express.json({ extended: true }))

//all routes in route folder
app.use(routes)

//serve static assets (build folder) if in production
if(process.env.NODE_ENV === 'production') {
  //sets static folder to build folder
  app.use(express.static('client/build'))
  //returns index.html for routes not handled above
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
} 
else {
  app.use('*', (req, res) => {
    res.status(501).json({msg: 'Server is not in production'})
  })
}

//environmental port (if deployed) or local port 5000
const port = process.env.PORT || 5000

//start server
app.listen(port, () => console.log(`Server started on port ${port}`))