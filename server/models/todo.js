const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {   //creating an object model -- will add any new 'Todo' object to a new collection of the title object -- title will be lower-cased and pluralized to 'todos'
	text: {                    //have to declare these in curlies
		type: String,
		require: true,  //so there must be a text prop -- validator
		minlength: 1,  //min length of string must be 1
		trim: true  //removes white space
	}, 
	completed: {
		type: Boolean,
		default: false  //setting default value
	},
	completedAt: {
		type: Number,
		default: null
	}
});


module.exports = {
	Todo
}