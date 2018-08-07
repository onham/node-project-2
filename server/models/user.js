const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({    //this is able to store the methods and properties associated with our User model 
	email: {                   
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {     //validation through validator library
			validator: validator.isEmail,    //boolean return 
			message: '{value} is not a valid email',
	 	}
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
	},
	tokens: [{     
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});


UserSchema.methods.toJSON = function() {    //'.toJSON' is a method that overrides the other methods in the schema
	const user = this;
	const userObject = user.toObject();  //this method is responsible for taking the Mongoose user object and coverting it into a regular object where only the props available on the doc exist 

	return _.pick(userObject, ['_id', 'email']);  //picking out the only fields we want to return
}


UserSchema.methods.generateAuthToken = function() {  //using a regular function as we need to bind our 'this' keyword to the doc
	const user = this;          //this will be an instance method
	const access = 'auth';

	const token = jwt.sign({
		_id: user._id.toHexString(), 
		access 
	}, 'abc123').toString();

	user.tokens = user.tokens.concat([{   //pushing to user's token array through concat
		access, 
		token 
	}]);

	return user.save().then(() => {
		return token;
	});
}


UserSchema.statics.findByToken = function(token) {    //statics are just methods added on to the model instead of the instance
	const User = this;
	let decoded;

	try {
		decoded = jwt.verify(token, 'abc123');
	} catch(e) {
		return Promise.reject    //returning rejected promise in case of error so our get request can catch error
	}

	return User.findOne({
		_id: decoded._id,
		'tokens.token': token,    //we put it in quotes because this is the way to query a nested document
		'tokens.access': 'auth'
	});
};

UserSchema.pre('save', function(next){  //mongoose middleware to run before a certain event
	const user = this;

	if (user.isModified('password')) {    //takes an individual property and returns true or false -- we only want to encrypt the pw if it is just modified
		bcrypt.genSalt(10, (err, salt) => {    
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		}); 
	} else {
		next();
	}   
});

const User = mongoose.model('User', UserSchema);

module.exports = {
	User
}