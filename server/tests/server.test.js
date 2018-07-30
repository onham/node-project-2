const expect = require('expect');
const supertest = require('supertest');
const assert = require('assert');
const { ObjectID } = require('mongodb');

const { Todo } = require('../models/todo');
const { app } = require('../server');

const todos = [{
	_id: new ObjectID(),      //declaring id here so we can use in test -- remember this is in hex
	text: 'first test todo'
},
{
	_id: new ObjectID(),
	text: 'second test todo'
}
];

beforeEach(async () => {
	await Todo.remove({});  //emptying out db before every test

	await Todo.insertMany(todos); //inserting our created array
})

describe('POST /todos', () => {
	it('should create a new todo', async () => {
		const text = 'test todo text';

		try {
			await supertest(app)
			.post('/todos')
			.send({
				text
			})
			.expect(200)
			.expect((res) => {    //remember that these are known as custom assumptions
				// expect(res.body.text).toBe(text)
				assert.equal(text, res.body.text);
			});

			await Todo.find({     //find only the entries with the text above
				text
			}).then((todos) => {
				assert.equal(1, todos.length);
				assert.equal(text, todos[0].text);
			});
		} catch(e) {
			console.log(e);
			return e;
		}
	});

	it('should not create todo with invalid arg data', async () => {
		try {
			await supertest(app)
			.post('/todos')
			.send({})
			.expect(400)
			.expect((res) => {
				Todo.find().then((todos) => {
					assert.equal(2, todos.length);
				})
			})
		} catch(e) {
			console.log(e);
			return e;
		}
	});
});

describe('GET /todos', () => {
	it('should get all todos', async () => {
		try {
			await supertest(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				assert.equal(2, res.body.todos.length)
			})
		} catch(e) {
			console.log(e);
			return e;
		}
	})
});

describe('GET /todos/:id', () => {
	it('should get a specific ID todo', async () => {
		try {
			await supertest(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				assert.equal(todos[0].text, res.body.todo.text)
			})
		} catch(e) {
			console.log(e);
			return e;
		}
	});

	it('should return a 404 if id not found', async () => {
		const id = new ObjectID();
		try {
			await supertest(app)
			.get(`/todos/${id.toHexString()}`)
			.expect(404)
		} catch(e) {
			console.log(e);
			return e;
		}
	});

	it('should return 404 for non-object ids', async () => {
		const id = new ObjectID();
		const nonId = `${id}11`;
		try {
			await supertest(app)
			.get(`/todos/${nonId}`)
			.expect(404)
		} catch(e) {
			console.log(e);
			return e;
		}
	});
})
