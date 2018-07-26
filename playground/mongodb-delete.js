const { MongoClient, ObjectID } = require('mongodb') //pulling off 'MongoClient' from library

const obj = new ObjectID();
console.log(obj);

MongoClient.connect(`mongodb://localhost:27017/TodoApp`, async (err, client) => {  //connecting to mongodb database
	if (err) {
		return console.log('unable to connect to server');
	}
	console.log(`connected to mongodb server`);

	const db = client.db('TodoApp');

	// deleteMany -- deleting many with the specified prop

	try {
		const res = await db.collection('Todos').deleteMany({
			name: 'Quanny'
		})
		console.log(res);
	} catch(err) {
		console.log(`something went wrong big man`);
	}

	// deleteOne  -- deleting one with the specified prop


	try {
		const res = await db.collection('Todos').deleteOne({
			text: 'eat once again'
		})
		console.log(res);
	} catch(err) {
		console.log(`something went wrong big man`);
	}

	// findOneAndDelete  -- finding the first entry with the specified prop and deleting


	try {
		const res = await db.collection('Todos').findOneAndDelete({
			_id: new ObjectID('5b5a101402e96f968236d525')
		})
		console.log(res);
	} catch(err) {
		console.log(`something went wrong big man`);
	}

	// client.close();
})