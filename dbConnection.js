const mongoose = require ('mongoose')

//connect to DB - process.env is nodemon.json when in dev
const connectDB = async () => {
  try {
    await mongoose
    .connect(process.env.mongoURI, {
      useNewUrlParser: true, 
      useCreateIndex: true, 
      useUnifiedTopology: true,
      useFindAndModify: false      
    })
    console.log('MongoDB connected...')
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

module.exports = connectDB