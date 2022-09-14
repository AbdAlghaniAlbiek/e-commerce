class AuthController {
	constructor({
		userRepo,
		httpResponse,
		paramertersError,
		jwt,
		aes,
		hashing
	}) {
		this.userRepo = userRepo
		this.httpResponse = httpResponse
		this.paramertersError = paramertersError
		this.jwt = jwt
		this.aes = aes
		this.hashing = hashing
	}

	async register(req, res) {
		if (!req.body) {
			res.status(400).json(
				this.httpResponse.ErrorResult(
					await this.aes.Encryption(this.paramertersError.bodyEmpty),
					''
				)
			)
		} else if (
			!req.body.username ||
			!req.body.email ||
			!req.body.password
		) {
			res.status(400).json(
				this.HttpResponseErrorResult(
					await this.aes.Encryption(
						this.paramertersError.somePropertiesNotFound
					),
					''
				)
			)
		}

		try {
			const username = await this.aes.Decryption(req.body.username.toString().replace(/ /g, '+')) // prettier-ignore
			const email = await this.aes.Decryption(req.body.username.toString().replace(/ /g, '+')) // prettier-ignore
			const password = await this.aes.Decryption(req.body.username.toString().replace(/ /g, '+')) // prettier-ignore

			const savedUser = await this.userRepo.createUser({
				username,
				email,
				password: await this.hashing.hashingPlainText(password),
				isAdmin: false,
				accessToken: '',
				refreshToken: '',
				provider: 'server'
			})

			// const newUser = new User({
			// 	username,
			// 	email,
			// 	password: await this.hashing.hashingPlainText(password),
			// 	isAdmin: false,
			// 	provider: 'server'
			// })

			// const savedUser = await newUser.save()

			const accessToken = await this.jwt.genAccessToken({
				id: savedUser._id,
				username: savedUser.username,
				provider: 'server'
			})
			const refreshToken = await this.jwt.genRefreshToken({
				id: savedUser._id,
				username: savedUser.username,
				provider: 'server'
			})

			const updatedUser = Object.assign({}, savedUser, {
				accessToken,
				refreshToken
			})

			await this.userRepo.updateUser(updatedUser.id, updatedUser)

			// await User.findByIdAndUpdate(
			// 	updatedUser._id,
			// 	{
			// 		$set: updatedUser
			// 	},
			// 	{ new: true }
			// )

			res.status(201).json(
				this.httpResponse.SuccessResult(
					await this.aes.Encryption(updatedUser.id.toString()),
					accessToken
				)
			)
		} catch (err) {
			res.status(500).json(
				this.httpResponse.ErrorResult(
					await this.aes.Encryption(err.toString()),
					''
				)
			)
		}
	}

	async login(req, res) {
		if (!req.body) {
			res.status(400).json(
				this.httpResponse.ErrorResult(
					await this.aes.Encryption(this.paramertersError.bodyEmpty),
					''
				)
			)
		} else if (!req.body.email || !req.body.password) {
			res.status(400).json(
				this.httpResponse.ErrorResult(
					await this.aes.Encryption(
						this.paramertersError.somePropertiesNotFound
					),
					''
				)
			)
		}

		const email = await this.aes.Decryption(req.body.username.toString().replace(/ /g, '+')) // prettier-ignore
		const password = await this.aes.Decryption(req.body.password.toString().replace(/ /g, '+')) // prettier-ignore

		try {
			// const user = User.findOne({ email })
			const user = await this.userRepo.getUserByEmail(email)

			if (!user) {
				res.status(404).json(
					this.httpResponse.ErrorResult(
						await this.aes.Encryption(
							"Your email or password isn't correct"
						),
						''
					)
				)
			}
			if (
				!this.hashing.comparePlainTextWithHash(password, user.password)
			) {
				res.status(404).json(
					this.httpResponse.ErrorResult(
						await this.aes.Encryption(
							"Your email or password isn't correct"
						),
						''
					)
				)
			}

			const accessToken = await this.jwt.genAccessToken({
				id: user._id,
				username: user.username
			})
			const refreshToken = await this.jwt.genRefreshToken({
				id: user._id,
				username: user.username
			})

			user.accessToken = accessToken
			user.refreshToken = refreshToken

			// await User.findByIdAndUpdate(
			// 	user._id,
			// 	{
			// 		$set: user
			// 	},
			// 	{ new: true }
			// )

			await this.userRepo.updateUser(user.id, user)

			res.status(201).json(
				this.httpResponse.SuccessResult(
					await this.aes.Encryption(user.id.toString()),
					accessToken
				)
			)
		} catch (err) {
			res.status(500).json(
				this.httpResponse.ErrorResult(
					await this.aes.Encryption(err.toString()),
					''
				)
			)
		}
	}
}

module.exports = AuthController
