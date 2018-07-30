const mongoose = require('mongoose');

const User = mongoose.model('User', {   
	user: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	email: {                   
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
});

module.exports = {
	User
}