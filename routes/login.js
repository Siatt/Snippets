const express = require('express')
const router = express.Router()
let controller = require('../controllers/loginController')
// const csrf = require('csurf')
// const csrfProtection = csrf({ cookie: true })

router.get('/', controller.index)

router.post('/', controller.postLogin)
module.exports = router
