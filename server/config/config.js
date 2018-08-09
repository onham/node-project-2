const env = process.env.NODE_ENV || 'development';  //this variable is currently set on heroku and not locally

if (env === 'development' || env === 'test') {
	const config = require('./config.json');
	const envConfig = config[env];

	Object.keys(envConfig).forEach((curr) => {
		process.env[curr] = envConfig[curr];
	});
}
