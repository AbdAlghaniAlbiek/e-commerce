const mongoose = require('mongoose')
const keys = require('../security/keys/keys')

module.exports = {
	mongooseInit: () => {
		mongoose
			.connect(keys.MONGO_CONNECTION_STRING)
			.then(() => {
				console.log('\nDBConnection successfull!')
			})
			.catch((err) => {
				console.log(
					`\nError caused when make connect to mongo db server | Details: ${err}`
				)
			})
	},

	postgressInit: () => {}
}
