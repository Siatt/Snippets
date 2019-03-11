const express = require('express')
const router = express.Router()
let controller = require('../controllers/signupController')
// const csrf = require('csurf')
// const csrfProtection = csrf({ cookie: true })
router.get('/', controller.index)

router.post('/', controller.postSignup)
module.exports = router
