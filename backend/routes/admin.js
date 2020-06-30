const express = require('express')
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const adminController = require('../controllers/adminController')

const router = express.Router()

router.post('/addcompany', adminAuth, adminController.addCompany)

router.patch('/addweek', adminAuth, adminController.addWeek)

router.patch('/subtractweek', adminAuth, adminController.subtractWeek)

module.exports = router
