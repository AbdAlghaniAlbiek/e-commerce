const helmet = require('helmet')
const hsts = require('hsts')
const mongoSecutiy = require('express-mongo-sanitize')
const dotenv = require('dotenv')

module.exports = function init(app) {
	dotenv.config({
		path: '../'
	})

	// secure your Express.js apps by setting various HTTP headers
	app.use(helmet())

	// This tells browsers, "hey, only use HTTPS for the next period of time"
	app.use(
		hsts({
			maxAge: 15552000 // 180 days in seconds
		})
	)

	// This module searches for any keys in objects that begin with a $ sign or contain a ., from req.body, req.query or req.params
	app.use(mongoSecutiy())
}
