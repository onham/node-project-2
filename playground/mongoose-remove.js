const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const id = '5b5b5723158058b670061879' ;


mongooseDelete = async () => {
	// await Todo.remove({}).then((result) => {
	// 	console.log(result);
	// });

	await Todo.findOneAndRemove({   //query any prop
		_id: '5b5f55aec01513b1101eaf1f'
	}).then((todo) => {
		console.log(todo);
	});

	await Todo.findByIdAndRemove('5b5f55aec01513b1101eaf1f').then((todo) => { 
		console.log(todo);
	});
}
mongooseDelete();