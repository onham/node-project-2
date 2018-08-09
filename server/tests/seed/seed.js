require('../../config/config');

const { ObjectID } = require('mongodb');
const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
{
	_id: userOneId,
	email: 'quanny@example.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({
			_id: userOneId,
			access: 'auth'
		}, process.env.JWT_SECRET).toString()
	}]
},
{
	_id: userTwoId,
	email: 'newquanny@mq.com',
	password: 'userTwoPass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({
			_id: userTwoId,
			access: 'auth'
		}, process.env.JWT_SECRET).toString()
	}]
}
];

const populateUsers = async () => {
	await User.remove({});

	const userOne = new User(users[0]).save();
	const userTwo = new User(users[1]).save();

	return Promise.all([userOne, userTwo]);  //Promise.all takes an array of promises --does not proceed until both entries in array are resolved
};

const todos = [{
	_id: new ObjectID(),      //declaring id here so we can use in test -- remember this is in hex
	text: 'first test todo',
	_creator: users[0]._id
},
{
	_id: new ObjectID(),
	text: 'second test todo',
	completed: true,
	completedAt: 333,
	_creator: users[1]._id
}
];

const populateTodos = async() => {
	await Todo.remove({});  //emptying out all items from collection before every test

	await Todo.insertMany(todos); //inserting our created array
}

module.exports = {
	todos,
	populateTodos,
	users,
	populateUsers
}