const express = require('express');
const bodyParser = require('body-parser');  //takes our strings and converts it to a js object

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

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

app.listen(3000, () => {
	console.log('starting on port 3000')
});

module.exports = {
	app
}