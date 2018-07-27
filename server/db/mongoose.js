
const mongoose = require('mongoose');  //using Mongoose to create a model for objects we want in our db

mongoose.Promise = global.Promise; //putting in a promise library

mongoose.connect('mongodb://localhost:27017/TodoApp');

// const Todo = mongoose.model('Todo', {   //creating an object model -- will add any new 'Todo' object to a new collection of the title object -- title will be lower-cased and pluralized to 'todos'
// 	text: {                    //have to declare these in curlies
// 		type: String,
// 		require: true,  //so there must be a text prop -- validator
// 		minlength: 1,  //min length of string must be 1
// 		trim: true  //removes white space
// 	}, 
// 	completed: {
// 		type: Boolean,
// 		default: false  //setting default value
// 	},
// 	completedAt: {
// 		type: Number,
// 		default: null
// 	}
// });


// const User = mongoose.model('User', {   
// 	user: {
// 		type: String,
// 		require: true,
// 		minlength: 1,
// 		trim: true
// 	},
// 	email: {                   
// 		type: String,
// 		require: true,
// 		minlength: 1,
// 		trim: true
// 	}
// });

// const newTodo = new Todo({   //creating a new item
// 	text: 'Cook dinner'
// });

// const quanUser = new User({
// 	user: 'quanny',
// 	email: 'easynham123@gmail.com'
// })

// quanUser.save().then((doc) => {
// 	console.log('saved new user', doc);
// }, (e) => {
// 	console.log('unable to save', e);
// });

// const quanTodo = new Todo({
// 	text: 23
// });

// quanTodo.save().then((doc) => {
// 	console.log('saved quan', doc);
// }, (e) => {
// 	console.log('unable to save', e);
// });


// newTodo.save().then((doc) => {
// 	console.log('saved item', doc);
// }, (e) => {
// 	console.log('unable to save', e);
// });

module.exports = {
	mongoose
}