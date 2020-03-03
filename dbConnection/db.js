const mongoose = require ('mongoose');

//connect to DB - process.env is nodemon.json when in dev
const connectDB = async () => {
  try {
    await mongoose
    //.connect(process.env.mongoURI, {
    .connect("mongodb+srv://kcharders:password321@fitness-website-cluster-lam0s.mongodb.net/test?retryWrites=true&w=majority", {
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