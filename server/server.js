require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');  //takes our strings and converts it to a js object
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT


app.use(bodyParser.json())     //configuring middleware


/* POST TODO */
app.post('/todos', authenticate, (req, res) => {   //making POST request to url of /todos, user input will be our text prop
	const todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save().then((doc) => {    //actually saving to the database
		res.send(doc);   //sending back the req to user
	}).catch((e) => {
		res.status(400).send(e);
 	});
})


/* GET ALL TODOS */
app.get('/todos', authenticate, (req, res) => {  //making GET request to url
	Todo.find({
		_creator: req.user._id
	}).then((todos) => {   //model method -- finding and retrieving all entries from our 'todos' collection
		res.send({     //sending back an object with our array in that object -- instead of sending back just an array, object provides more flexibility for the future
			todos
		})
	}).catch((e) => {
		res.status(400).send(e);
	})
})


/* GET TODO BY ID */
app.get('/todos/:id', authenticate, (req, res) => {
    //so here we are sending back the key-value pair associated with param designated after :
	const id = req.params.id

	if (!(ObjectID.isValid(id))){  //this method returns true if valid and false otherwise
		return res.status(404).send();
	}    

	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
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


/* DELETE TODO BY ID */
app.delete('/todos/:id', authenticate, (req, res) => {
	const id = req.params.id;

	if (!ObjectID.isValid(id)){  
		return res.status(404).send();
	}    

	Todo.findOneAndRemove({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
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


/* UPDATE TODO */
app.patch(`/todos/:id`, authenticate, (req, res) => {
	const id = req.params.id;
	const body = _.pick(req.body, ['text', 'completed'])    //pick method of lodash allows you to scan the body of the request and turn its props into props of the const you declared

	if (!ObjectID.isValid(id)){  
		return res.status(404).send();
	}   

	if (_.isBoolean(body.completed) && body.completed) {   //if the completed field is a boolean and if it is true aka completed
		body.completedAt = new Date().getTime(); //milliseconds after jan. 1 1970
	} else {
		body.completed = false;
		body.completedAt = null;   //null removes the prop from the body
	}

	Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
	}, {$set: body}, {new: true}).then((todo) => {    //takes mongodb operators -- new returns updated entry to us
		if (!todo) {
			return res.status(404).send();
		}

		res.send({
			todo
		})
	}).catch((e) => {
		res.status(400).send();
	})
});


/* POST USER */
app.post('/users/', (req, res) => {
	const body = _.pick(req.body, ['email', 'password']);   

	const user = new User(body);


	user.save().then(() =>                      // we removed the arg here -- functionality still the same
		user.generateAuthToken()  
	).then((token) => {
		res.header('x-auth', token).send(user);  //setting our header
		//'x-___' -- generating custom header for our specific purposes
		//we have to send the token back as an http response header
	}).catch((e) => {
		res.status(400).send(e);	
	})
});


/* GET USER BY TOKEN */
app.get('/users/me', authenticate, (req, res) => {   //we put authenticate func in our middleware folder
	res.send(req.user);
});


/* USER LOGIN */
app.post('/users/login', (req, res) => {
	const body = _.pick(req.body, ['email', 'password']);   

	User.findByCredentials(body.email, body.password).then((user) => {
		user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((e) => {
		res.status(400).send(e);
	});
});


/* LOGGING OUT */
app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	});
});

app.listen(port, () => {
	console.log(`starting on port ${port}`);
});


module.exports = {
	app
}