// const User = require('../models/User')
const container = require('../helpers/IoC/container')
const { asValue } = require('awilix')

class VerifyToken {
	constructor({ jwt, httpResponse, responseMessages, userRepo }) {
		this.jwt = jwt
		this.httpResponse = httpResponse
		this.authErrors = responseMessages.authErrors
		this.userRepo = userRepo
	}

	verifyToken(req, res, next) {
		if (!req.header.authorization) {
			console.error(this.authErrors.Unauthorized)
			res.status(401).json(
				this.httpResponse.ErrorResult(this.authErrors.Unauthorized, '')
			)
		}

		const accessToken = req.header.authorization.split(' ')[1]

		if (!accessToken) {
			console.error(this.authErrors.Unauthorized)
			res.status(401).json(
				this.httpResponse.ErrorResult(this.authErrors.Unauthorized, '')
			)
		}

		this.jwt
			.verifyAccessToken(accessToken)
			.then(async (accTokPayload) => {
				const user = await this.userRepo.getUserById(accTokPayload)
				// const user = User.findById(accTokPayload.id)

				req.scope = container.createScope()
				req.scope.register({
					userCred: asValue({
						user,
						newToken: ''
					})
				})

				next()
			})
			.catch(async (err) => {
				console.error(err)

				try {
					const decAccToken = await this.jwt.decodeToken(accessToken)
					var user = await this.userRepo.getUserById(decAccToken.id)
					// var user = await User.findById(decAccToken.id)

					this.jwt
						.verifyRefreshToken(user.refreshToken)
						.then(async (refTokPayload) => {
							try {
								const newAccToken =
									await this.jwt.genAccessToken({
										id: refTokPayload.id,
										username: refTokPayload.username,
										provider: refTokPayload.provider
									})
								const newRefToken =
									await this.jwt.genRefreshToken({
										id: refTokPayload.id,
										username: refTokPayload.username,
										provider: refTokPayload.provider
									})

								user.accessToken = newAccToken
								user.refreshToken = newRefToken

								await this.userRepo.updateUser(
									refTokPayload.id,
									user
								)

								// await User.findByIdAndUpdate(
								// 	refTokPayload.id,
								// 	{
								// 		$set: user
								// 	},
								// 	{ new: true }
								// )

								req.scope = container.createScope()
								req.scope.register({
									userCred: asValue({
										user,
										newToken: newAccToken
									})
								})

								next()
							} catch (err) {
								console.error(err)
								res.status(500).json(
									this.httpResponse.ErrorResult(err.toString(),'') // prettier-ignore
								)
							}
						})
						.catch((err) => {
							console.error(err)
							res.status(401).json(
								this.httpResponse.ErrorResult(this.authErrors.Unauthorized,'') // prettier-ignore
							)
						})
				} catch (err) {
					console.error(err)
					res.status(500).json(
						this.httpResponse.ErrorResult(err.toString(), '')
					)
				}
			})
	}

	verifyTokenAndAdmin(req, res, next) {
		this.verifyToken(req, res, () => {
			const isAdmin = req.scope.resolve('userCred').user.isAdmin
			const newToken = req.scope.resolve('userCred').newToken

			if (isAdmin) {
				next()
			} else {
				res.status(403).json(
					this.httpResponse.ErrorResult(
						this.authErrors.ForbiddenAccess,
						newToken
					)
				)
			}
		})
	}
}

module.exports = VerifyToken
