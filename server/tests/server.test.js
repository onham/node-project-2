const expect = require('expect');
const supertest = require('supertest');

const { Todo } = require('../models/todo');
const { app } = require('../server');

beforeEach(async () => {
	await Todo.remove({})  //emptying out db before every test
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
			.expect((res) => {
				expect(res.body.text).toBe(text)
			});

			await Todo.find().then((todos) => {
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
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
				expect(todos.length).toBe(0);
			});
		} catch(e) {
			console.log(e);
			return e;
		}
	});
});