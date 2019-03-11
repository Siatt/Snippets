const User = require('../models/User')
module.exports.index = (req, res, next) => {
  res.render('signup/index')
}
module.exports.postSignup = async (req, res, next) => {
  try {
    const account = new User({
      username: req.body.username,
      password: req.body.password,
      date: new Date()
    })
    req.checkBody('username')
      .isAlphanumeric().withMessage('Invalid Username')
      .isLength({ min: 1, max: 20 }).withMessage('Username to long Max:20')
    req.checkBody('password')
    // change min to 8 when handing in
      .isLength({ min: 1, max: 30 }).withMessage('Password length invalid Min: 8 Max: 30')
      .matches('^[a-zA-Z0-9!@#$&()\\-`.+,/"]*$').withMessage('Invalid Pasword')
    const errors = req.validationErrors()
    if (errors) {
      errors.forEach(function (err) {
        req.session.flash = { type: 'warning', text: err.msg }
      })
      return res.redirect('/signup')
    }

    await User.findOne({ username: account.username }, async (err, user) => {
      if (err) return err
      if (user) {
        req.session.flash = { type: 'warning', text: 'Username already exsists' }
        res.redirect('/signup')
      } else {
        await account.save().then(res => {
          console.log('Hejsan')
          console.log(res)
        })
        res.redirect('/login')
      }
    })
  } catch (err) {
    next(err)
  }
}
