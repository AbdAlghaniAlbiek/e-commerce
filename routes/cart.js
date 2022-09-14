const { verifyToken } = require('./verify_token')
const router = require('express').Router()
const {
	createCart,
	deleteCart,
	getAllUsersCrats,
	getUserCart,
	updateCart
} = require('../controllers/cart')

// CREATE
router.post('/', verifyToken, createCart)

// UPDATE
router.put('/:id', verifyToken, updateCart)

// DELETE
router.delete('/:id', verifyToken, deleteCart)

// GET USER CART
router.get('/:userId', verifyToken, getUserCart)

// GET ALL
router.get('/', verifyToken, getAllUsersCrats)

module.exports = router
