const { User } = require('../models/user');

/* PRIVATE ROUTE MIDDLEWARE */
const authenticate = (req, res, next) => {   //our middleware function
	const token = req.header('x-auth'); //fetching the header x-auth

	User.findByToken(token).then((user) => {
		if (!user) {
			return Promise.reject();
		}
		req.user = user;
		req.token = token;
		next();
	}).catch((e) => {
		res.status(401).send()
	});
}

module.exports = {
	authenticate
}