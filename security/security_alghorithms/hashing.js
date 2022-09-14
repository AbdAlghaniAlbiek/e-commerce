const bcrypt = require('bcryptjs')

class Hashing {
	constructor({ config }) {
		this.hashSalt = config.HASH_SALT
	}

	hashingPlainText(plainText) {
		return new Promise((resolve, reject) => {
			bcrypt.genSalt(this.hashSalt, function (err, salt) {
				if (err) {
					reject(
						`\nError caused when it generate salt for hashing | Details: ${err}`
					)
				}
				bcrypt.hash(plainText, salt, function (err, hash) {
					if (err) {
						reject(
							`\nError caused when make hashing for plain text | Details: ${err}`
						)
					}

					resolve(hash)
				})
			})
		})
	}

	comparePlainTextWithHash(plaintext, hashText) {
		return new Promise((resolve, reject) => {
			bcrypt.compare(plaintext, hashText, function (err, compareResult) {
				if (err) {
					reject(
						`\nError caused when compare hash to palin text | Details: ${err}`
					)
				}

				resolve(compareResult)
			})
		})
	}
}

module.exports = Hashing
