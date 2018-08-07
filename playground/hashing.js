const { SHA256 } = require('crypto-js'); //
const jwt = require('jsonwebtoken'); //our web token library
const bcrypt = require('bcryptjs'); //our password hasher

const password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {   //our salt generator 
	bcrypt.hash(password, salt, (err, hash) => {
		console.log(hash); 
	});
}); 

const data = {
	id: 11
}

const token = jwt.sign(data, '123abc');     //takes object and creates hash and returns token
console.log(token);


const decodedRes = jwt.verify(token, '123abc');   //takes token and salt and makes sure it was not changed
// returns decoded result
console.log(decodedRes);































// let message = 'I am user number 3';
// let hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// const data = {  //our token data -- contains our token/user id
// 	id: 4,

// };

// const token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + `somesecret`).toString()   //hashing the token/user id
// };

// //an adversary would manipulate the token like this::
// token.data.id = 5;  //manipulating the id
// token.hash = SHA256(JSON.stringify(token.data)).toString(); //attempting to hash the data

// const resultHash = SHA256(JSON.stringify(token.data) + `somesecret`).toString();

// if (resultHash === token.hash) {
// 	console.log('Data was not changed');
// } else {
// 	console.log(`Data was changed. Don't trust.`);
// }