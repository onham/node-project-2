const mongoose = require('mongoose');  //using Mongoose to create a model for objects we want in our db


mongoose.Promise = global.Promise; //putting in a promise library

//connecting to mongodb:: if unable to connect to Heroku 
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports = {
	mongoose
}