const jwt = require('jsonwebtoken')

class TokenGenerator {
	constructor({ config }) {
		this.privateKey = config.JWT.PRIVATE_KEY
		this.publicKey = config.JWT.PUBLIC_KEY
		this.options = {
			algorithm: config.JWT.OPTIONS.ALGORITHM,
			keyid: config.JWT.OPTIONS.KEY_ID,
			noTimestamp: config.JWT.OPTIONS.NO_TIMESTAMP
		}
		//algorithm + keyid + noTimestamp + notBefore
	}

	sign(payload, signOptions) {
		return new Promise((resolve, reject) => {
			const jwtSignOptions = Object.assign({}, signOptions, this.options)

			jwt.sign(payload, this.privateKey, jwtSignOptions, (err, token) => {
				if (err) {
					reject(
						`\nError caused when creating a token | Details: ${err}`
					)
				}

				resolve(token)
			})
		})
	}

	verify(token, verifyOptions) {
		return new Promise((resolve, reject) => {
			jwt.verify(token, this.publicKey, verifyOptions, (err, payload) => {
				if (err.name === 'TokenExpiredError') {
					reject(
						`\nError because the token has been expired | Details: ${err}`
					)
				} else if (err.name === 'JsonWebTokenError') {
					reject(
						`\nError caused when verifying the token | Details: ${err}`
					)
				} else if (err.name === 'NotBeforeError') {
					reject(
						`\nError because the current time isn't equal or after the date that registered in 'not before' claim | Details: ${err}`
					)
				}

				resolve(payload)
			})
		})
	}

	decode(token) {
		return new Promise((resolve, reject) => {
			jwt.verify(
				token,
				this.publicKey,
				{
					ignoreExpiration: true,
					ignoreNotBefore: true,
					complete: true
				},
				(err, payload) => {
					if (err) {
						reject(
							`\nError caused when trying decoding jwt token | Details: ${err}`
						)
					}
					resolve(payload)
				}
			)
		})
	}
}

module.exports = TokenGenerator
