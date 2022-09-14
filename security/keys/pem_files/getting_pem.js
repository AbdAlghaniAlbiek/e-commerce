const fs = require('fs')

module.exports = {
	getPrivateKey: () => {
		return new Promise((resolve, reject) => {
			fs.readFile('./private.pem', 'utf8', (err, data) => {
				if (err) {
					reject(
						`\nError caused when trying read private.pem file | Details: ${err}`
					)
				}

				resolve(data.toString())
			})
		})
	},

	getPublickKey: () => {
		return new Promise((resolve, reject) => {
			fs.readFile('./public.pem', 'utf8', (err, data) => {
				if (err) {
					reject(
						`\nError caused when trying read public.pem file | Details: ${err}`
					)
				}

				resolve(data.toString())
			})
		})
	}
}
