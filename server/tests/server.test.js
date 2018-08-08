const expect = require('expect');
const supertest = require('supertest');
const assert = require('assert');
const { ObjectID } = require('mongodb');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { app } = require('../server');


beforeEach(populateUsers);
beforeEach(populateTodos);

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
		const id = new ObjectID().toHexString();
		try {
			await supertest(app)
			.get(`/todos/${id}`)
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
});

describe('DELETE /todos/:id', () => {
	it('should delete an item by id', async () => {
		const hexId = todos[1]._id.toHexString();
		try {
			await supertest(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				assert.equal(todos[1].text, res.body.todo.text)
			});

			await Todo.findById(hexId).then((todo) => {
				assert.equal(null, todo);
			});
		} catch(e) {
			console.log(e);
			return e;
		}
	});

	it('should return a 404 if id not found', async () => {
		const id = new ObjectID().toHexString();		
		try {
			await supertest(app)
			.delete(`/todos/${id}`)
			.expect(404)
		} catch(e) {
			console.log(e);
			return e;
		}
	});

	it('should return 404 if object id is invalid', async () => {
		const id = new ObjectID().toHexString();
		const nonId = `${id}1`;
		try {
			await supertest(app)
			.delete(`/todos/${nonId}`)
			.expect(404)
		} catch(e) {
			console.log(e);
			return e;
		}
	});
})

describe('PATCH /todos/:id', () => {
	it('should be able to update items', async () => {
		const firstId = todos[0]._id.toHexString();
		const text = 'updating through test'
		try {
			await supertest(app)
			.patch(`/todos/${firstId}`)
			.send({
				text,
				completed: true
			})
			.expect(200)
			.expect((res) => {
				assert.equal(text, res.body.todo.text);
				assert.ok(res.body.todo.completed);
				assert.equal('number', typeof(res.body.todo.completedAt));
			})
		} catch(e) {
			console.log(e);
			return e;
		}
	});

	it('should clear completedAt when todo is not completed', async () => {
		const secondId = todos[1]._id.toHexString();
		const text = 'updating second entry text'
		try {
			await supertest(app)
			.patch(`/todos/${secondId}`)
			.send({
				text, 
				completed: false
			})
			.expect(200)
			.expect((res) => {
				assert.equal(null, res.body.todo.completedAt);
				assert.equal(text, res.body.todo.text);
				assert.equal(false, res.body.todo.completed);
			})
		} catch(e) {
			console.log(e);
			return e;
		}
	});
});


describe('GET /users/me', () => {
	it('should return user if authenticated', async () => {
		try {
			await supertest(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				assert.equal(users[0]._id.toHexString(), res.body._id);
				assert.equal(users[0].email, res.body.email);
			})
		} catch(e) {
			console.log(e);
			return e;
		}
	});

	it('should return 401 if not authenticated', async () => {
		try {
			await supertest(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})	
		} catch(e) {
			console.log(e);
			return e;
		}
	});
});


describe('POST /users/', () => {
	it('should create a user', async () => {
		const email = 'easyquanny@gmail.com';
		const password = 'test123';

		try {
			await supertest(app)
			.post('/users/')
			.send({
				email,
				password
			})
			.expect(200)
			.expect(async (res) => {
				assert.ok(res.headers['x-auth']);
				assert.equal(email, res.body.email);
				assert.ok(res.body._id);
				assert.notEqual(password, res.body.password);


				const user = await User.findOne({email});
				assert.ok(user);
			})
		} catch(e) {
			console.log(e);
			return (e);
		}
	});
	it('should return validation errors if request invalid', async () => {
		try {
			await supertest(app)
			.post('/users/')
			.send({
				email: 'hi',
				password: '123'
			})
			.expect(400)
		} catch(e) {
			console.log(e);
			return e;
		}
	});
	it('should not create user if email in use', async () => {
		try {
			await supertest(app)
			.post('/users')
			.send({
				email: users[0].email,
				password: '123'
			})
			.expect(400)
		} catch(e) {
			console.log(e);
			return e;
		}
	});
});


describe('POST /users/login', () => {
	it('should login user and return auth token', async () => {
		try {
			await supertest(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect((res) => {
				assert.ok(res.headers['x-auth'])
				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[0]).toInclude({
						access: 'auth',
						token: res.headers['x-auth']
					});
				});
			});
		} catch(e) {
			console.log(e);
			return e;
		}
	});

	it('should reject invalid login', async () => {
		try {
			await supertest(app)
			.post('/users/login')
			.send({
				email: users[0].email,
				password: '123'
			})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist();
			});
		} catch(e) {
			console.log(e);
			return e;
		}
	});
});