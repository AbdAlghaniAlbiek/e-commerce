class UserRepo {
	constructor({ pgPool, responseMessage }) {
		this.pgPool = pgPool
		this.failedCRUD = responseMessage.failedCRUD
		this.successCRUD = responseMessage.successCRUD
	}

	createUser(user) {
		new Promise((resolve, reject) => {
			this.pgPool
				.query(
					'INSERT INTO user(username, email, password, is_admin, access_token, refresh_token, provider, createdAt) VALUES($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING * ',
					[
						user.username,
						user.email,
						user.password,
						user.isAdmin,
						user.accessToken,
						user.refreshToken,
						user.provider
					]
				)
				.then((result) => {
					if (result.rowCount === 0) {
						reject(
							this.failedCRUD.insertedItem(`user: ${user.username}`) // prettier-ignore
						)
					}

					console.log(
						this.successCRUD.insertedItem(`user ${user.username}`)
					)
					const { password, ...userData } = result.rows[0]
					resolve(userData)
				})
				.catch((err) => {
					console.error(err)
					reject(
						this.failedCRUD.insertedItem(`user: ${user.username}`)
					)
				})
		})
	}

	updateUser(id, user) {
		new Promise((resolve, reject) => {
			this.pgPool
				.query(
					'UPDATE user ' +
						'SET username = $1, email = $2, is_admin = $3, access_token = $4, refresh_token = $5, provider = $6 ' +
						'WHERE id = $7',
					[
						user.username,
						user.email,
						user.isAdmin,
						user.accessToken,
						user.refreshToken,
						user.provider,
						id
					]
				)
				.then((result) => {
					if (result.rowCount === 0) {
						reject(
							this.failedCRUD.updatedItem(`user: ${user.username}`) // prettier-ignore
						)
					}
					console.log(
						this.successCRUD.updatedItem(`user: ${user.username}`)
					)
					const { password, ...userData } = result.rows[0]
					resolve(userData)
				})
				.catch((err) => {
					console.error(err)
					reject(
						this.failedCRUD.updatedItem(`user: ${user.username}`)
					)
				})
		})
	}

	deleteUser(id) {
		new Promise((resolve, reject) => {
			this.pgPool
				.query('DELETE FROM user WHERE id = $1', [id])
				.then((result) => {
					if (result.rowCount === 0) {
						reject(this.failedCRUD.deletedItem(`user`))
					}
					resolve(this.successCRUD.deletedItem(`user`))
				})
				.catch((err) => {
					console.err(err)
					reject(this.failedCRUD.deletedItem(`user`))
				})
		})
	}

	getUserById(id) {
		return new Promise((resolve, reject) => {
			this.pgPool
				.query('SELECT * FROM user WHERE id = $1', [id])
				.then((result) => {
					if (result.rows.length === 0) {
						reject(this.failedCRUD.gettingItem('user'))
					}
					console.log(this.successCRUD.gettingItem('user'))
					const { password, ...userData } = result.rows[0]
					resolve(userData)
				})
				.catch((err) => {
					console.error(err)
					reject(this.failedCRUD.gettingItem('user'))
				})
		})
	}

	// Getting all user data including password (for login purposes)
	getUserByEmail(email) {
		return new Promise((resolve, reject) => {
			this.pgPool
				.query('SELECT * FROM user WHERE email = $1', [email])
				.then((result) => {
					if (result.rows.length === 0) {
						reject(this.failedCRUD.gettingItem(`user`))
					}

					console.log(this.successCRUD.gettingItem(`user`))
					resolve(result.rows[0])
				})
				.catch((err) => {
					console.error(err)
					reject(this.failedCRUD.gettingItem(`user`))
				})
		})
	}

	getAllUsers(offset, limit) {
		return new Promise((resolve, reject) => {
			this.pgPool
				.query('SELECT * FROM user' + 'OFFSET = $1 ' + 'LIMIT = $2', [
					offset,
					limit
				])
				// eslint-disable-next-line no-unused-vars
				.then((result) => {
					resolve(this.successCRUD.gettingItems('users'))
				})
				.catch((err) => {
					console.error(err)
					reject(this.failedCRUD.gettingItems('users'))
				})
		})
	}
}

module.exports = UserRepo
