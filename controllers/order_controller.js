const Order = require('../models/Order')
const {
	paramertersError,
	HttpResponseErrorResult
} = require('../helpers/handle_errors')
const { HttpResponseSuccess } = require('../helpers/handle_results')
const {
	aesEncryption,
	aesDecryption
} = require('../security/security_alghorithms/aes')

module.exports = {
	createOrder: async (req, res) => {
		if (!req.body) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.bodyEmpty),
					req.userCred.newToken
				)
			)
		} else if (req.body.products.length === 0) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(
						paramertersError.collectionMustNotBeEmpty('products')
					),
					req.userCred.newToken
				)
			)
		} else if (
			!req.body.userId ||
			!req.body.products ||
			!req.body.status ||
			!req.body.address ||
			Object.keys(req.body.products[0])[0] !== 'productId' ||
			Object.keys(req.body.products[0])[1] !== 'amount'
		) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.somePropertiesNotFound),
					req.userCred.newToken
				)
			)
		}

		const userId = aesDecryption(
			req.body.userId.toString().replace(/ /g, '+')
		)
		const amount = aesDecryption(
			req.body.userId.toString().replace(/ /g, '+')
		)
		const status = aesDecryption(
			req.body.userId.toString().replace(/ /g, '+')
		)
		const address = aesDecryption(
			req.body.userId.toString().replace(/ /g, '+')
		)
		const products = req.body.products.foreach((product) => {
			product.productId = aesDecryption(
				product.productId.toString().replace(/ /g, '+')
			)
			product.amount = aesDecryption(
				product.amount.toString().replace(/ /g, '+')
			)
		})

		const newOrder = new Order({
			userId,
			amount,
			status,
			address,
			products
		})

		try {
			const savedOrder = await newOrder.save()
			res.status(201).json(
				HttpResponseSuccess(
					aesEncryption(savedOrder._id),
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

	updateOrder: async (req, res) => {
		if (!req.params) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.pathParamsEmpty),
					req.userCred.newToken
				)
			)
		} else if (!req.params.id) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.someParamerterNotFound),
					req.userCred.newToken
				)
			)
		}
		if (!req.body) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.bodyEmpty),
					req.userCred.newToken
				)
			)
		} else if (req.body.products.length === 0) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(
						paramertersError.collectionMustNotBeEmpty('products')
					),
					req.userCred.newToken
				)
			)
		} else if (
			!req.body.userId ||
			!req.body.products ||
			!req.body.status ||
			!req.body.address ||
			Object.keys(req.body.products[0])[0] !== 'productId' ||
			Object.keys(req.body.products[0])[1] !== 'amount'
		) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.somePropertiesNotFound),
					req.userCred.newToken
				)
			)
		}

		const id = aesDecryption(req.params.id.toString().replace(/ /g, '+'))
		const userId = aesDecryption(
			req.body.userId.toString().replace(/ /g, '+')
		)
		const amount = aesDecryption(
			req.body.userId.toString().replace(/ /g, '+')
		)
		const status = aesDecryption(
			req.body.userId.toString().replace(/ /g, '+')
		)
		const address = aesDecryption(
			req.body.userId.toString().replace(/ /g, '+')
		)
		const products = req.body.products.foreach((product) => {
			product.productId = aesDecryption(
				product.productId.toString().replace(/ /g, '+')
			)
			product.amount = aesDecryption(
				product.amount.toString().replace(/ /g, '+')
			)
		})

		try {
			const updateOrder = await Order.findByIdAndUpdate(
				id,
				{
					$set: {
						userId,
						amount,
						status,
						address,
						products
					}
				},
				{ new: true }
			)

			res.status(200).json(
				HttpResponseSuccess(
					aesEncryption(updateOrder._id),
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

	deleteOrder: async (req, res) => {
		if (!req.params) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.pathParamsEmpty),
					req.userCred.newToken
				)
			)
		} else if (!req.params.id) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.someParamerterNotFound),
					req.userCred.newToken
				)
			)
		}

		const id = aesDecryption(req.params.id.toString().replace(/ /g, '+'))

		try {
			await Order.findByIdAndDelete(id)
			res.status(200).json(
				HttpResponseSuccess(
					aesEncryption('Order has been deleted ...'),
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

	getUserOrders: async (req, res) => {
		if (!req.params) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.pathParamsEmpty),
					req.userCred.newToken
				)
			)
		} else if (!req.params.userId) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.someParamerterNotFound),
					req.userCred.newToken
				)
			)
		}

		const userId = aesDecryption(
			req.params.userId.toString().replace(/ /g, '+')
		)

		try {
			const orders = await Order.find({ userId })

			orders.foreach((order) => {
				order.userId = aesEncryption(order.userId)
				order.status = aesEncryption(order.status)
				order.address = aesEncryption(order.address)
				order.products.foreach((product) => {
					product.productId = aesEncryption(product.productId)
					product.amount = aesEncryption(product.amount)
				})
			})

			res.status(200).json(
				HttpResponseSuccess(orders, req.userCred.newToken)
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

	getAllUsersOrders: async (req, res) => {
		try {
			const orders = await Order.find()

			orders.foreach((order) => {
				order.userId = aesEncryption(order.userId)
				order.status = aesEncryption(order.status)
				order.address = aesEncryption(order.address)
				order.products.foreach((product) => {
					product.productId = aesEncryption(product.productId)
					product.amount = aesEncryption(product.amount)
				})
			})

			res.status(200).json(
				HttpResponseSuccess(orders, req.userCred.newToken)
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

	getMonthlyIncome: async (req, res) => {
		const date = new Date()
		const lastPreviousMonth = new Date(date.setMonth(date.getMonth() - 2))

		try {
			const income = await Order.aggregate([
				{ $match: { createdAt: { $gte: lastPreviousMonth } } },
				{
					$project: {
						month: { $month: '$createdAt' },
						sales: '$amount'
					}
				},
				{
					$group: {
						_id: '$month',
						total: { $sum: '$sales' }
					}
				}
			])

			income.foreach((item) => {
				item._id = aesEncryption(item._id)
				item.total = aesEncryption(item.total)
			})

			res.status(200).json(
				HttpResponseSuccess(income, req.userCred.newToken)
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
