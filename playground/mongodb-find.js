const { MongoClient, ObjectID } = require('mongodb') //pulling off 'MongoClient' from library

const obj = new ObjectID();
console.log(obj);

MongoClient.connect(`mongodb://localhost:27017/TodoApp`, async (err, client) => {  //connecting to mongodb database
	if (err) {
		return console.log('unable to connect to server');
	}
	console.log(`connected to mongodb server`);

	const db = client.db('TodoApp');

	// try {
	// 	const arr = await db.collection('Todos').find({
	// 		_id: new ObjectID('5b5a101402e96f968236d525')  //declaring the key-value pairs we want to find
	// 	}).toArray();  //fetching from todos and turning to array
	// 	console.log(JSON.stringify(arr, undefined, 2));
	// } catch(err) {
	// 	console.log('unable to fetch items', err);
	// }

	try {
		const arr = await db.collection('Todos').find({
			name: 'Quanny'
		}).toArray();
		console.log(JSON.stringify(arr, undefined, 2));
	} catch(err) {
		console.log('unable to fetch items', err);
	}

	try {
		const count = await db.collection('Todos').count({
			name: 'Quanny'
		})  //counting number of items with count
		console.log(`Item count: ${count}`);
	} catch(err) {
		console.log(`error getting count`);
	}


	// client.close();
})