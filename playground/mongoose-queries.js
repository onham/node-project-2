const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const id = '5b5b5723158058b670061879' ;


bigFinder = async () => {

	if (!ObjectID.isValid(id)){  //this method returns true if valid and false otherwise
		console.log('ID not valid');
	}    

	await User.findById(id).then((user) => {   //this method finds specifically by id
		if (!user) {
			return console.log('id not found');
		}
		console.log(user)
	}).catch((e) => console.log(e));

	await Todo.find({    //getting all of our items with that id in the collection as an array
		_id: id    //the only reason we can do this is because of Mongoose -- remember in our mongo files when we had to declare a new ObjectID? not anymore
	}).then((todos) => {
		console.log(todos);
	});

	await Todo.findOne({  // getting one item with that id -- comes back as an object as opposed to an array
		_id: id
	}).then((todo) => {
		console.log(todo)
	})

	await Todo.findById(id).then((todo) => {   //this method finds specifically by id
		if (!todo) {
			return console.log('id not found');
		}
		console.log(todo)
	}).catch((e) => console.log(e));
}
bigFinder();