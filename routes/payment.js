const router = require('express').Router()
const { makePayment } = require('../controllers/payment')
const { verifyToken } = require('./verify_token')

router.post('/payment', verifyToken, makePayment)

module.exports = router
