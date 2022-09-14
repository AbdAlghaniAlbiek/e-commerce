const router = require('express').Router()
const { login, register } = require('../controllers/auth')

// REGISTER
router.post('/register', register)

// LOGIN
router.get('/login', login)

module.exports = router
