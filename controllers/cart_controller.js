// const Cart = require('../models/Cart')

class CartController {
	constructor({ httpResponse, aes, responseMessages, cartRepo, reqScope }) {
		this.httpResponse = httpResponse
		this.aes = aes
		this.paramertersError = responseMessages.paramertersError
		this.cartRepo = cartRepo
		this.userCred = reqScope.auth.userCred
	}

	async createCart(req, res) {
		const newToken = req.scope.resolve(this.userCred).newToken

		if (!req.body) {
			res.status(400).json(
				this.httpResponse.ErrorResult(
					await this.aes.Encryption(this.paramertersError.bodyEmpty),
					newToken
				)
			)
		} else if (!req.body.userId || !req.body.products) {
			res.status(400).json(
				this.httpResponse.ErrorResult(
					await this.aes.Encryption(
						this.paramertersError.somePropertiesNotFound
					),
					newToken
				)
			)
		}

		var userId = this.aes.Decryption(req.body.userId.toString().replace(/ /g, '+')) // prettier-ignore
		const products = req.body.products.foreach((product) => {
			product.productId = this.aes.Decryption(
				product.productId.toString().replace(/ /g, '+')
			)
			product.quantity = this.aes.Decryption(
				product.quantity.toString().replace(/ /g, '+')
			)
		})

		// const newCart = new Cart({ userId, products })

		// const savedCart = await newCart.save()
		products.foreach(async (product) => {
			try {
				await this.cartRepo.createCart(
					userId,
					product.Id,
					product.quantity
				)
			} catch (err) {
				this.httpResponse.ErrorResult(
					this.aes.Encryption(err.toString()),
					''
				)
			}
		})

		res.status(201).json(
			this.httpResponse.SuccessResult(
				await this.aes.Encryption('cart has inserted successfully'),
				newToken
			)
		)
	}

	async updateCart(req, res) {
		const newToken = req.scope.resolve(this.userCred).newToken

		if (!req.params) {
			this.httpResponse.ErrorResult(
				await this.aes.Encryption(
					this.paramertersError.pathParamsEmpty
				),
				newToken
			)
		}
		if (!req.params.id) {
			res.status(400).json(
				this.httpResponse.ErrorResult(
					await this.aes.Encryption(
						this.paramertersError.someParamerterNotFound
					),
					newToken
				)
			)
		}

		const id = this.aes.Decryption(req.params.id.toString().replace(/ /g, '+')) // prettier-ignore

		try {
			const updateCart = await Cart.findByIdAndUpdate(
				id,
				{
					$set: req.body
				},
				{ new: true }
			)

			res.status(200).json(
				new HttpResponse(
					updateCart,
					res.userCred.newToken ? res.userCred.newToken : '',
					''
				).getObject()
			)
		} catch (err) {
			res.status(500).json(
				new HttpResponse(
					null,
					res.userCred.newToken ? res.userCred.newToken : '',
					aesEncryption(err.toString())
				).getObject()
			)
		}
	}

	async deleteCart(req, res) {
		if (!req.params) {
			res.status(400).json(
				new HttpResponse(
					null,
					res.userCred.newToken ? res.userCred.newToken : '',
					aesEncryption(paramertersError.pathParamsEmpty)
				).getObject()
			)
		}
		if (!req.params.id) {
			res.status(400).json(
				new HttpResponse(
					null,
					res.userCred.newToken ? res.userCred.newToken : '',
					aesEncryption(paramertersError.someParamerterNotFound)
				).getObject()
			)
		}

		const id = aesDecryption(req.params.id.toString().replace(/ /g, '+'))

		try {
			await Cart.findByIdAndDelete(id)
			res.status(200).json(
				new HttpResponse(
					aesEncryption('Cart has been deleted ...'),
					res.userCred.newToken ? res.userCred.newToken : '',
					''
				).getObject()
			)
		} catch (err) {
			res.status(500).json(
				new HttpResponse(
					null,
					res.userCred.newToken ? res.userCred.newToken : '',
					aesEncryption(err.toString())
				).getObject()
			)
		}
	}

	async getUserCart(req, res) {
		if (!req.params) {
			res.status(400).json(
				new HttpResponse(
					null,
					res.userCred.newToken ? res.userCred.newToken : '',
					aesEncryption(paramertersError.pathParamsEmpty)
				).getObject()
			)
		}
		if (!req.params.userId) {
			res.status(400).json(
				new HttpResponse(
					null,
					res.userCred.newToken ? res.userCred.newToken : '',
					aesEncryption(paramertersError.someParamerterNotFound)
				).getObject()
			)
		}

		const userId = aesDecryption(
			req.params.userId.toString().replace(/ /g, '+')
		)

		try {
			const cart = await Cart.findOne({ userId })
			res.status(200).json(
				new HttpResponse(
					cart,
					res.userCred.newToken ? res.userCred.newToken : '',
					''
				).getObject()
			)
		} catch (err) {
			res.status(500).json(
				new HttpResponse(
					null,
					res.userCred.newToken ? res.userCred.newToken : '',
					aesEncryption(err.toString())
				).getObject()
			)
		}
	}

	async getAllUsersCrats(req, res) {
		try {
			const carts = await Cart.find()

			res.status(500).json(
				new HttpResponse(
					carts,
					req.userCred.newToken ? req.userCred.newToken : '',
					''
				).getObject()
			)
		} catch (err) {
			res.status(500).err(err)
		}
	}
}

module.exports = CartController
