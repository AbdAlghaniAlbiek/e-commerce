const router = require('express').Router()
const {
	createOrder,
	deleteOrder,
	getAllUsersOrders,
	getMonthlyIncome,
	getUserOrders,
	updateOrder
} = require('../controllers/order')
const { verifyToken, verifyTokenAndAdmin } = require('./verify_token')

// CREATE
router.post('/', verifyToken, createOrder)

// UPDATE
router.put('/:id', verifyTokenAndAdmin, updateOrder)

// DELETE
router.delete('/:id', verifyTokenAndAdmin, deleteOrder)

// GET USER ORDERS
router.get('/:userId', verifyToken, getUserOrders)

// GET ALL
router.get('/', verifyTokenAndAdmin, getAllUsersOrders)

// GET MONTHLY INCOME
router.get('/income', verifyTokenAndAdmin, getMonthlyIncome)

module.exports = router
