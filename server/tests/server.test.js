const expect = require('expect');
const supertest = require('supertest');
const assert = require('assert');

const { Todo } = require('../models/todo');
const { app } = require('../server');

const todos = [{
	text: 'first test todo'
},
{
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
				// expect(todos.length).toBe(3);
				// expect(todos[2].text).toBe(text);
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

			await Todo.find().then((todos) => {
				// expect(todos.length).toBe(2);
				assert.equal(2, todos.length)
			});
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
		}
	})
});