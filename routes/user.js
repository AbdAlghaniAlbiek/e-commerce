const router = require('express').Router()
const { verifyToken, verifyTokenAndAdmin } = require('./verify_token')
const {
	deleteUser,
	getAllUsers,
	getUser,
	getUserStats,
	updateUser
} = require('../controllers/user')

// UPDATE
router.put('/:id', verifyToken, updateUser)

// DELETE
router.delete('/:id', verifyToken, deleteUser)

// GET
router.get('/:id', verifyToken, getUser)

// GET ALL USERS
router.get('/', verifyTokenAndAdmin, getAllUsers)

// GET USER STATS
router.get('/stats', verifyTokenAndAdmin, getUserStats)

module.exports = router
