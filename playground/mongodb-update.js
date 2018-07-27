const { MongoClient, ObjectID } = require('mongodb') //pulling off 'MongoClient' from library

const obj = new ObjectID();
console.log(obj);

MongoClient.connect(`mongodb://localhost:27017/TodoApp`, async (err, client) => {  //connecting to mongodb database
	if (err) {
		return console.log('unable to connect to server');
	}
	console.log(`connected to mongodb server`);

	const db = client.db('TodoApp');

	//update 

	// const res = await db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID('5b5a1b3402e96f968236d730')
	// }, {
	// 	$set: {  //this is the mongodb update operator 
	// 		complete: true
	// 	}
	// }, {
	// 	returnOriginal: false  //returning the updated file
	// })

	const res = await db.collection('Todos').findOneAndUpdate({
		_id: new ObjectID('5b5a24b603718da59cf47c59')
	}, {
		$set: {  //this is the mongodb update operator 
			name: 'Quan da Gawd'
		},
		$inc: {
			age: 4
		}
	}, {
		returnOriginal: false  //returning the updated file
	})


	console.log(res)

	// client.close();
})