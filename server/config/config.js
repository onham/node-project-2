const env = process.env.NODE_ENV || 'development';  //this variable is currently set on heroku and not locally

if (env === 'development') {  //setting dev environment case
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';  //separate local db created for testing
}
