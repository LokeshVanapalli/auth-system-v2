const express = require('express')
const { home } = require('../controllers/authController')
const router = express.Router()

router.route('/main').get(home)

module.exports = router