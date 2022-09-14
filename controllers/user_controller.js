const {
	HttpResponseErrorResult,
	paramertersError
} = require('../helpers/handle_errors')
const { HttpResponseSuccess } = require('../helpers/handle_results')
const { hashingPlainText } = require('../security/security_alghorithms/hashing')
const {
	aesDecryption,
	aesEncryption
} = require('../security/security_alghorithms/aes')
const User = require('../models/User')

module.exports = {
	updateUser: async (req, res) => {
		if (!req.params) {
			res.status(400).json(
				HttpResponseErrorResult(
					paramertersError.pathParamsEmpty,
					req.userCred.newToken
				)
			)
		} else if (!req.params.id) {
			res.status(400).json(
				HttpResponseErrorResult(
					paramertersError.someParamerterNotFound,
					req.userCred.newToken
				)
			)
		}
		if (!req.body) {
			res.status(400).json(
				HttpResponseErrorResult(
					paramertersError.bodyEmpty,
					req.userCred.newToken
				)
			)
		} else if (
			!req.body.username ||
			!req.body.email ||
			!req.body.password
		) {
			res.status(400).json(
				HttpResponseErrorResult(
					paramertersError.somePropertiesNotFound,
					req.userCred.newToken
				)
			)
		}

		const id = aesDecryption(req.body.id.toString().replace(/ /g, '+')) // ignore-prettier
		const email = aesDecryption(
			req.body.email.toString().replace(/ /g, '+')
		) // ignore-prettier
		const username = aesDecryption(
			req.body.username.toString().replace(/ /g, '+')
		) // ignore-prettier
		let password = aesDecryption(
			req.body.password.toString().replace(/ /g, '+')
		) // ignore-prettier

		password = await hashingPlainText(password)

		try {
			const updateUser = await User.findByIdAndUpdate(
				id,
				{
					$set: {
						username,
						email,
						password
					}
				},
				{ new: true }
			)

			res.status(200).json(
				HttpResponseSuccess(
					aesEncryption(updateUser.doc._id),
					req.userCred.newToken
				)
			)
		} catch (err) {
			res.status(500).json(
				HttpResponseErrorResult(
					aesEncryption(err.toString()),
					req.userCred.newToken
				)
			)
		}
	},

	deleteUser: async (req, res) => {
		if (!req.params) {
			res.status(400).json(
				HttpResponseErrorResult(
					paramertersError.pathParamsEmpty,
					req.userCred.newToken
				)
			)
		} else if (!req.params.id) {
			res.status(400).json(
				HttpResponseErrorResult(
					paramertersError.someParamerterNotFound,
					req.userCred.newToken
				)
			)
		}

		const id = aesDecryption(req.body.id.toString().replace(/ /g, '+')) // ignore-prettier

		try {
			await User.findByIdAndDelete(id)
			res.status(200).json(
				HttpResponseSuccess(
					aesEncryption('User has been deleted ...'),
					req.userCred.newToken
				)
			)
		} catch (err) {
			res.status(500).json(
				HttpResponseErrorResult(
					aesEncryption(err.toString()),
					req.userCred.newToken
				)
			)
		}
	},

	getUser: async (req, res) => {
		if (!req.params) {
			res.status(400).json(
				HttpResponseErrorResult(
					paramertersError.pathParamsEmpty,
					req.userCred.newToken
				)
			)
		} else if (!req.params.id) {
			res.status(400).json(
				HttpResponseErrorResult(
					paramertersError.someParamerterNotFound,
					req.userCred.newToken
				)
			)
		}

		const id = aesDecryption(req.body.id.toString().replace(/ /g, '+')) // ignore-prettier

		try {
			const user = await User.findById(id)

			// eslint-disable-next-line no-unused-vars
			const { password, ...others } = user._doc

			others._id = aesEncryption(others._id)
			others.username = aesEncryption(others.username)
			others.email = aesEncryption(others.email)
			others.createdAt = aesEncryption(others.createdAt)
			others.updatedAt = aesEncryption(others.updatedAt)

			res.status(200).json(
				HttpResponseSuccess(others, req.userCred.newToken)
			)
		} catch (err) {
			res.status(500).json(
				HttpResponseErrorResult(
					aesEncryption(err.toString()),
					req.userCred.newToken
				)
			)
		}
	},

	getAllUsers: async (req, res) => {
		if (!req.query) {
			res.status(400).json(
				HttpResponseErrorResult(
					paramertersError.queryParamsEmpty,
					req.userCred.newToken
				)
			)
		} else if (!req.query.new) {
			res.status(400).json(
				HttpResponseErrorResult(
					paramertersError.someParamerterNotFound,
					req.userCred.newToken
				)
			)
		}

		const query = aesDecryption(req.query.new.toString().replace(/ /g, '+'))

		try {
			const users = query
				? await User.find().sort({ _id: -1 }).limit(query)
				: await User.find()

			const {
				// eslint-disable-next-line no-unused-vars
				password, // eslint-disable-next-line no-unused-vars
				accessToken, // eslint-disable-next-line no-unused-vars
				refreshToken, // eslint-disable-next-line no-unused-vars
				provider, // eslint-disable-next-line no-unused-vars
				__v, // eslint-disable-next-line no-unused-vars
				...others
			} = users

			others.username = aesEncryption(others.username)
			others.email = aesEncryption(others.email)
			others.createdAt = aesEncryption(others.createdAt)
			others.updatedAt = aesEncryption(others.updatedAt)
			const id = aesEncryption(others._id)

			res.status(200).json(
				HttpResponseSuccess(
					{
						id,
						...others
					},
					req.userCred.newToken
				)
			)
		} catch (err) {
			res.status(500).json(
				HttpResponseErrorResult(
					aesEncryption(err.toString()),
					req.userCred.newToken
				)
			)
		}
	},

	getUserStats: async (req, res) => {
		const date = new Date()
		const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

		try {
			const data = await User.aggregate([
				{ $match: { createdAtDate: { $gte: lastYear } } },
				{
					$project: {
						month: { month: '$createdAt' }
					}
				},
				{
					$group: {
						_id: '$month',
						total: { $sum: 1 }
					}
				}
			])

			if (data.length !== 0) {
				data.forEach((item) => {
					item._id = aesEncryption(item._id)
					item.total = aesEncryption(item.total)
				})
			}

			res.status(200).json(
				HttpResponseSuccess(data, req.userCred.newToken)
			)
		} catch (err) {
			res.status(500).json(
				HttpResponseErrorResult(
					aesEncryption(err.toString()),
					req.userCred.newToken
				)
			)
		}
	}
}
