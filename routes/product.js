const router = require('express').Router()
const { verifyToken, verifyTokenAndAdmin } = require('./verify_token')
const {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductById,
	updateProduct
} = require('../controllers/product')

// CREATE
router.post('/', verifyTokenAndAdmin, createProduct)

// UPDATE
router.put('/:id', verifyTokenAndAdmin, updateProduct)

// DELETE
router.delete('/:id', verifyTokenAndAdmin, deleteProduct)

// GET
router.get('/:id', verifyToken, getProductById)

// GET ALL PRODUCTS
router.get('/', verifyToken, getAllProducts)

module.exports = router
