const {
	HttpResponseErrorResult,
	paramertersError
} = require('../helpers/handle_errors')
const { HttpResponseSuccess } = require('../helpers/handle_results')
const {
	aesDecryption,
	aesEncryption
} = require('../security/security_alghorithms/aes')
const Product = require('../models/Product')

module.exports = {
	createProduct: async (req, res) => {
		if (!req.body) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.bodyEmpty),
					req.userCred.newToken
				)
			)
		} else if (req.body.categories.length === 0) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(
						paramertersError.collectionMustNotBeEmpty('categories')
					),
					req.userCred.newToken
				)
			)
		} else if (
			!req.body.title ||
			!req.body.desc ||
			!req.body.img ||
			!req.body.categories ||
			!req.body.size ||
			!req.body.color ||
			!req.body.price
		) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.somePropertiesNotFound),
					req.userCred.newToken
				)
			)
		}

		const title = aesDecryption(
			req.body.title.toString().replace(/ /g, '+')
		)
		const desc = aesDecryption(req.body.desc.toString().replace(/ /g, '+'))
		const img = aesDecryption(req.body.img.toString().replace(/ /g, '+'))
		const size = aesDecryption(req.body.size.toString().replace(/ /g, '+'))
		const color = aesDecryption(
			req.body.color.toString().replace(/ /g, '+')
		)
		const price = aesDecryption(
			req.body.price.toString().replace(/ /g, '+')
		)
		const categories = req.body.categories.map((category) => {
			aesDecryption(category)
		})

		const newProduct = new Product({
			title,
			desc,
			img,
			size,
			color,
			price,
			categories
		})

		try {
			const savedProduct = await newProduct.save()
			res.status(200).json(
				HttpResponseSuccess(
					aesEncryption(savedProduct._id),
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

	updateProduct: async (req, res) => {
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
		} else if (req.body.categories.length === 0) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(
						paramertersError.collectionMustNotBeEmpty('categories')
					),
					req.userCred.newToken
				)
			)
		} else if (
			!req.body.title ||
			!req.body.desc ||
			!req.body.img ||
			!req.body.categories ||
			!req.body.size ||
			!req.body.color ||
			!req.body.price
		) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.somePropertiesNotFound),
					req.userCred.newToken
				)
			)
		}

		const id = aesDecryption(req.params.id.toString().replace(/ /g, '+'))
		const title = aesDecryption(
			req.body.title.toString().replace(/ /g, '+')
		)
		const desc = aesDecryption(req.body.desc.toString().replace(/ /g, '+'))
		const img = aesDecryption(req.body.img.toString().replace(/ /g, '+'))
		const size = aesDecryption(req.body.size.toString().replace(/ /g, '+'))
		const color = aesDecryption(
			req.body.color.toString().replace(/ /g, '+')
		)
		const price = aesDecryption(
			req.body.price.toString().replace(/ /g, '+')
		)
		const categories = req.body.categories.map((category) => {
			aesDecryption(category)
		})

		try {
			const updateProduct = await Product.findByIdAndUpdate(
				id,
				{
					$set: {
						title,
						desc,
						img,
						size,
						color,
						price,
						categories
					}
				},
				{ new: true }
			)

			res.status(200).json(
				HttpResponseSuccess(
					aesEncryption(updateProduct._id),
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

	deleteProduct: async (req, res) => {
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
			await Product.findByIdAndDelete(id)
			res.status(200).json(
				HttpResponseSuccess(
					aesEncryption('Product has been deleted ...'),
					req.userCred.newToken
				)
			)
		} catch (err) {
			HttpResponseErrorResult(
				aesEncryption(err.toString()),
				req.userCred.newToken
			)
		}
	},

	getProductById: async (req, res) => {
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
			const product = await Product.findById(id)

			product.title = aesEncryption(product.title)
			product.desc = aesEncryption(product.desc)
			product.img = aesEncryption(product.img)
			product.size = aesEncryption(product.size)
			product.color = aesEncryption(product.color)
			product.price = aesEncryption(product.price)
			const categories = product.categories.map((category) => {
				aesEncryption(category)
			})
			product.categories = categories

			res.status(200).json(
				HttpResponseSuccess(product, req.userCred.newToken)
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

	getAllProducts: async (req, res) => {
		if (!req.query) {
			res.status(400).json(
				HttpResponseErrorResult(
					paramertersError.queryParamsEmpty,
					req.userCred.newToken
				)
			)
		}

		try {
			let products = null

			if (req.query.qNew) {
				products = await Product.find().sort({ createdAt: -1 }).limit(5)
			} else if (req.query.qCategory) {
				products = await Product.find({
					categories: {
						$in: [req.query.qCategory]
					}
				})
			} else {
				products = await Product.find()
			}

			products.forEach((product) => {
				product.title = aesEncryption(product.title)
				product.desc = aesEncryption(product.desc)
				product.img = aesEncryption(product.img)
				product.size = aesEncryption(product.size)
				product.color = aesEncryption(product.color)
				product.price = aesEncryption(product.price)
				const categories = product.categories.map((category) => {
					aesEncryption(category)
				})
				product.categories = categories
			})

			res.status(200).json(
				HttpResponseSuccess(products, req.userCred.newToken)
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
