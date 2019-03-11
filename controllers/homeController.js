const User = require('../models/User')
module.exports.index = async (req, res, next) => {
  try {
    const content = await User.find({ snippets: { $exists: true, $ne: [] } })
    let user
    if (req.cookies.user_id && req.session.user) {
      user = req.session.user
    }
    res.render('home/index', { user, content })
  } catch (error) {
    next(error)
  }
}

module.exports.logout = async (req, res, next) => {
  res.clearCookie('user_id')
  res.redirect('/')
}
