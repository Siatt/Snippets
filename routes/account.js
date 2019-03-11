const express = require('express')
const router = express.Router()
const controller = require('../controllers/accountController')
// Unless they are logged in return 401
router.use((req, res, next) => {
  if (req.cookies.user_id && req.session.user) {
    next()
  } else {
    const error = new Error('Not Found')
    error.status = 401
    error.message = 'Not authorized'
    next(error)
  }
})

router.get('/', controller.index)

router.route('/create')
  .get(controller.create)
  .post(controller.createPost)

router.get('/delete/:id', controller.delete)
router.post('/delete', controller.deletePost)

router.get('/edit/:id', controller.edit)
router.post('/edit', controller.editPost)

module.exports = router
