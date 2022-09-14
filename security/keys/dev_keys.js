/* eslint-disable no-undef */
const { getPrivateKey, getPublickKey } = require('./pem_files/getting_pem')

module.exports = {
	MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,

	PG_CONNNECTION_STRING: process.env.PG_CONNNECTION_STRING,

	PORT: process.env.PORT,

	NODE_ENV: process.env.NODE_ENV,

	AES: {
		BUFFER_ENCRYPTION: process.env.AES_BUFFER_ENCRYPTION,
		ENCRYPTION_TYPE: process.env.AES_ENCRYPTION_TYPE,
		ENCRYPTION_ENCODING: process.env.AES_ENCRYPTION_ENCODING,
		KEY: process.env.AES_KEY.toString(),
		IV: process.env.AES_IV.toString()
	},

	HASH_SALT: process.env.HASH_SALT,

	JWT: {
		OPTIONS: {
			ALGORITHM: process.env.ALGORITHM,
			ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
			REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
			NO_TIMESTAMP: process.env.NO_TIMESTAMP,
			KEY_ID: process.env.KEY_ID,
			AUDIENCE: process.env.AUDIENCE,
			ISSUER: process.env.ISSUER,
			JWT_ID: process.env.JWT_ID,
			NOT_BEFORE: process.env.NOT_BEFORE,
			SUBJECT: process.env.SUBJECT
		},
		PRIVATE_KEY: getPrivateKey()
			.then((data) => data)
			.catch((err) => {
				throw Error(err)
			}),
		PUBLIC_KEY: getPublickKey()
			.then((data) => data)
			.catch((err) => {
				throw Error(err)
			}),
		SECRET_KEY_WORD: process.env.SECRET_KEY_WORD.toString()
	},

	STRIPE: {
		SECRET_KEY: process.env.SECRET_STRIPE_KEY.toString(),
		PUBLISHABLE_KEY: process.env.PUBLISHABLE_STRIPE_KEY.toString()
	}
}
