const express = require('express')
const cors = require('cors')

module.exports = function init(app) {
	// Adding express middleware to simplify the process of making server
	app = express()

	// For converting the body data into vanilla js object
	app.use(express.json())

	// For converting the url-encoded form data into vanilla js object
	app.use(express.urlencoded({ extended: true }))

	// Adding Cors to make domains share and send their resources to each other with easy way
	app.use(cors())
}
