/*
	Important Note: token's payload must have at least these properties: username, id, provider, keyWord 
*/

class JWT {
	constructor({ tokenGen, config }) {
		this.tokenGen = tokenGen
		this.options = {
			secretKeyWord: config.JWT.SECRET_KEY_WORD,
			audience: config.JWT.OPTIONS.AUDIENCE,
			issuer: config.JWT.OPTIONS.ISSUER,
			accessTokenExpiresIn: config.JWT.OPTIONS.ACCESS_TOKEN_EXPIRES_IN,
			refreshTokenExpiresIn: config.JWT.OPTIONS.REFRESH_TOKEN_EXPIRES_IN
		}
	}

	genAccessToken(payload) {
		return new Promise((resolve, reject) => {
			const compPayload = Object.assign({}, payload, {
				keyWord: this.options.secretKeyWord
			})

			this.tokenGen
				.sign(
					compPayload, // the payload 'should' have (username, id, provider) as public claims at least
					{
						audience: this.options.audience,
						issuer: this.options.issuer,
						subject: payload.username,
						expiresIn: this.options.accessTokenExpiresIn
					}
				)
				.then((token) => resolve(token))
				.catch((err) => reject(err))
		})
	}

	genRefreshToken(payload) {
		return new Promise((resolve, reject) => {
			this.tokenGen
				.sign(
					payload, // the payload 'should' have (name, email, id) as public claims at least
					{
						subject: payload.username,
						expiresIn: this.options.refreshTokenExpiresIn
					}
				)
				.then((token) => resolve(token))
				.catch((err) => reject(err))
		})
	}

	verifyAccessToken(token) {
		return new Promise((resolve, reject) => {
			this.tokenGen
				.verify(token, {
					audience: this.options.audience,
					issuer: this.options.issuer
				})
				.then((payload) => {
					if (!payload.keyWord) {
						reject('\nPayload does not have keyword')
					} else if (payload.keyWord !== this.options.secretKeyWord) {
						reject(
							`\nPayload doesn't equal the stored keyword in server`
						)
					}
					resolve(payload)
				})
				.catch((err) => {
					reject(err)
				})
		})
	}

	verifyRefreshToken(token) {
		return new Promise((resolve, reject) => {
			this.tokenGen
				.verify(token, null)
				.then((payload) => {
					resolve(payload)
				})
				.catch((err) => {
					reject(err)
				})
		})
	}

	decodeToken(token) {
		return new Promise((resolve, reject) => {
			this.tokenGen
				.decode(token)
				.then((payload) => {
					resolve(payload)
				})
				.catch((err) => reject(err))
		})
	}
}

module.exports = JWT
