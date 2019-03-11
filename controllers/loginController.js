const User = require('../models/User')

module.exports.index = (req, res) => {
  res.render('login/index')
}
module.exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
      req.session.flash = { type: 'warning', text: 'Wrong username or password' }
      return res.redirect('/login')
    }
    let isMatch = await user.comparePassword(req.body.password)
    if (isMatch) {
      req.session.user = user
      res.redirect('/')
    } else if (!isMatch) {
      req.session.flash = { type: 'warning', text: 'Wrong username or password' }
      res.redirect('/login')
    }
  } catch (err) {
    next(err)
  }
}
