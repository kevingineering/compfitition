const mongoose = require ('mongoose');
//const config = require('config');

//gets db connection string
//TODO - REMOVE DB KEYS FROM CODE
//const db = config.get('mongoURI');
const db = "mongodb+srv://kcharders:password321@fitness-website-cluster-lam0s.mongodb.net/test?retryWrites=true&w=majority";

//connect to DB
const connectDB = async () => {
  try {
    await mongoose
    .connect(db, {
      useNewUrlParser: true, 
      useCreateIndex: true, 
      useUnifiedTopology: true,
      useFindAndModify: false      
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;