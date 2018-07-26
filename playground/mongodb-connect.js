const { MongoClient, ObjectID } = require('mongodb') //pulling off 'MongoClient' from library

const obj = new ObjectID();
console.log(obj);

MongoClient.connect(`mongodb://localhost:27017/TodoApp`, (err, client) => {  //connecting to mongodb database
	if (err) {
		return console.log('unable to connect to server');
	}
	console.log(`connected to mongodb server`);

	const db = client.db('TodoApp');

	// db.collection(`Todos`).insertOne({
	// 	text: 'buy hygiene products from drug store',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log(`unable to insert item`, err);
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));

	// });

	db.collection('Todos').insertOne({
		// _id: 123 , // we can customize the id number
		name: 'Quanny',
		age: 26
	}, (err, res) => {
		if (err) {
			return console.log(`something went wrong`, err);
		}
		console.log(res.ops[0]._id.getTimestamp());
	});


	client.close(); //finalizes connection with server
});  