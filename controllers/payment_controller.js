const { HttpResponseSuccess } = require('../helpers/handle_results')
const { STRIPE } = require('../security/keys/keys')
const stripe = require('stripe')(STRIPE.SECRET_KEY)
const {
	paramertersError,
	HttpResponseErrorResult
} = require('../helpers/handle_errors')
const {
	aesDecryption,
	aesEncryption
} = require('../security/security_alghorithms/aes_algh')

module.exports = {
	makePayment: (req, res) => {
		if (!req.body) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.bodyEmpty),
					req.userCred.newToken
				)
			)
		} else if (!req.body.tokenId || !req.body.amount) {
			res.status(400).json(
				HttpResponseErrorResult(
					aesEncryption(paramertersError.somePropertiesNotFound),
					req.userCred.newToken
				)
			)
		}

		const tokenId = aesDecryption(
			req.body.tokenId.toString().replace(/ /g, '+')
		)
		const amount = aesDecryption(
			req.body.amount.toString().replace(/ /g, '+')
		)

		stripe.chages.create(
			{
				source: tokenId,
				amount: amount,
				currency: 'usd'
			},
			(stripeErr, stripeRes) => {
				if (stripeErr) {
					res.status(500).json(
						HttpResponseErrorResult(
							stripeErr,
							req.userCred.newToken
						)
					)
				} else {
					res.status(200).json(
						HttpResponseSuccess(stripeRes, req.userCred.newToken)
					)
				}
			}
		)
	}
}
