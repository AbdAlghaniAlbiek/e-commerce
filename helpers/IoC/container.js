const {
	createContainer,
	asValue,
	asFunction,
	asClass,
	InjectionMode
} = require('awilix')

const keys = require('../../security/keys/keys')
const reqScope = require('./req_scope')
const HttpResponse = require('../response_handlers/HttpResponse')
const responseMessages = require('../response_handlers/response_messages')

const AES = require('../../security/security_alghorithms/aes')
const Hashing = require('../../security/security_alghorithms/hashing')

const TokenGenerator = require('../../security/auth/token_generator')
const JWT = require('../../security/auth/jwt')

const { Pool } = require('pg')

const UserRepo = require('../../data/pg_repos/user_repo')
const CartRepo = require('../../data/pg_repos/cart_repo')

const VerifyToken = require('../../middlewares/verify_token')

const AuthController = require('../../controllers/auth_controller')
const CartController = require('../../controllers/cart_controller')
const OrderController = require('../../controllers/order_controller')
const ProductController = require('../../controllers/product_controller')
const UserController = require('../../controllers/user_controller')

// Create the container and set the injectionMode to PROXY (which is also the default).
const container = createContainer({
	injectionMode: InjectionMode.PROXY
})

container.register({
	config: asValue(keys).singleton(),
	reqScope: asValue(reqScope).singleton(),
	responseMessages: asValue(responseMessages).singleton(),

	httpResponse: asClass(HttpResponse).transient(),

	aes: asClass(AES).singleton(),
	hashing: asClass(Hashing).singleton(),

	tokenGen: asClass(TokenGenerator).singleton(),

	jwt: asFunction(JWT).singleton(),

	pgPool: asFunction(
		(cradle) =>
			new Pool({ connectionString: cradle.config.PG_CONNNECTION_STRING })
	)
		.disposer((pgPool) => pgPool.end())
		.singleton(),

	verifyToken: asClass(VerifyToken).scoped(),

	userRepo: asClass(UserRepo).singleton(),
	cartRepo: asClass(CartRepo).singleton(),

	authController: asClass(AuthController).scoped(),
	cartController: asClass(CartController).scoped(),
	orderController: asClass(OrderController).scoped(),
	productController: asClass(ProductController).scoped(),
	userController: asClass(UserController).scoped()
})

module.exports = container
