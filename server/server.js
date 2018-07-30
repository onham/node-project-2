const express = require('express');
const bodyParser = require('body-parser');  //takes our strings and converts it to a js object
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json())     //configuring middleware


app.post('/todos', (req, res) => {   //making POST request to url of /todos, user input will be our text prop
	const todo = new Todo({
		text: req.body.text,
	});

	todo.save().then((doc) => {    //actually saving to the database
		res.send(doc);   //sending back the req to user
	}, (e) => {
		res.status(400).send(e);
 	});
})


app.get('/todos', (req, res) => {  //making GET request to url
	Todo.find().then((todos) => {   //model method -- finding and retrieving all entries from our 'todos' collection
		res.send({     //sending back an object with our array in that object -- instead of sending back just an array, object provides more flexibility for the future
			todos
		})
	}, (e) => {
		res.status(400).send(e);
	})
})


app.get('/todos/:id', (req, res) => {
    //so here we are sending back the key-value pair associated with param designated after :
	const id = req.params.id

	if (!(ObjectID.isValid(id))){  //this method returns true if valid and false otherwise
		return res.status(404).send();
	}    

	Todo.findById(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({
			todo
		});
	}).catch((e) => {
		res.status(400).send()
	});
});


app.listen(port, () => {
	console.log(`starting on port ${port}`);
});


module.exports = {
	app
}