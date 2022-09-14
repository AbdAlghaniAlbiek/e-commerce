const { mongooseInit, postgressInit } = require('./initialize/database_init')
const middlewareInit = require('./initialize/routes')
const securityInit = require('./initialize/security')
const routesInit = require('./initialize/routes')
const keys = require('./security/keys/keys')

mongooseInit()

const app = null

// Including main middlewares like: express, cors
middlewareInit(app)

// Including security middlewares like: helmet, hsts, xss, express-mongo-sanitize
securityInit(app)

// Including routes for this app
routesInit(app)

app.set('port', keys.PORT || 5000)

app.listen(app.get('port'), () => {
	console.log('Backend server is running')
})
