const mongoose = require ('mongoose');
const config = require('config');

//gets db connection string
const db = config.get('mongoURI');

//connect to DB
const connectDB = async () => {
  try {
    await mongoose
    .connect(db, {
      useNewUrlParser: true, 
      useCreateIndex: true, 
      useUnifiedTopology: true
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;