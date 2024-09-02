const express = require('express')
const { register, login, forgetPassword, verifyOTP, update, verifyResetToken } = require('../controllers/authController')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forget-password', forgetPassword)
router.post('/verify', verifyOTP)
router.patch('/update', update)
router.get('/verify-reset-token', verifyResetToken)

module.exports = router