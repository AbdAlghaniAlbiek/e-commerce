class CartRepo {
	constructor({ pgPool, responseMessage }) {
		this.pgPool = pgPool
		this.failedCRUD = responseMessage.failedCRUD
		this.successCRUD = responseMessage.successCRUD
	}

	createCart(userId, productId, quantity) {
		new Promise((resolve, reject) => {
			this.pgPool
				.query(
					'INSERT INTO cart(user_id, product_id, quantity) VALUES($1, $2, $3) RETURNING * ',
					[userId, productId, quantity]
				)
				.then((result) => {
					if (result.rowCount === 0) {
						reject(
							this.failedCRUD.insertedItem(`cart`) // prettier-ignore
						)
					}

					console.log(this.successCRUD.insertedItem(`cart`))
					resolve(result.rows[0])
				})
				.catch((err) => {
					console.error(err)
					reject(this.failedCRUD.insertedItem(`cart`))
				})
		})
	}

	updateCart(userId, productId, quantity) {
		new Promise((resolve, reject) => {
			this.pgPool
				.query(
					'UPDATE cart ' +
						'SET quantity = $1' +
						'WHERE user_id = $2 AND product_id = $3',
					[quantity, userId, productId]
				)
				.then((result) => {
					if (result.rowCount === 0) {
						reject(
							this.failedCRUD.updatedItem(`cart`) // prettier-ignore
						)
					}
					console.log(this.successCRUD.updatedItem(`cart`))
					resolve(result.rows[0])
				})
				.catch((err) => {
					console.error(err)
					reject(
						this.failedCRUD.updatedItem(`user: ${user.username}`)
					)
				})
		})
	}
}

module.exports = CartRepo
