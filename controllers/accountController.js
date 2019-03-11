const User = require('../models/User')
let user
/**
 * index GET
 */
module.exports.index = async (req, res, next) => {
  try {
    if (req.cookies.user_id && req.session.user) {
      user = req.session.user
    }
    let result = await User.findOne({ username: req.session.user.username }, { snippets: 1 })
    let snippets = result.snippets.reverse()
    res.render('account/index', { user, snippets })
  } catch (error) {
    next(error)
  }
}
/**
 * create GET
 */
module.exports.create = async (req, res, next) => {
  res.render('account/create', { user })
}

/**
 * crete POST
 */
module.exports.createPost = async (req, res, next) => {
  try {
    const result = await User.updateOne({ username: req.session.user.username }, {
      $push: { snippets: { tags: req.body.tags.split(','), snippet: req.body.snippet } }
    })
    if (result.nModified === 1) {
      req.session.flash = { type: 'success', text: 'Snippet saved' }
    }
    res.redirect('/account')
  } catch (error) {
    next(error)
  }
}

/**
 * delete GET
 */
module.exports.delete = async (req, res, next) => {
  try {
    const user = await User.findOne({ 'snippets._id': req.params.id }, { snippets: { $elemMatch: { _id: req.params.id } } })
    const content = {
      id: user.snippets[0]._id,
      tags: user.snippets[0].tags,
      snippet: user.snippets[0].snippet
    }
    res.render('account/delete', { user, content })
  } catch (error) {
    next(error)
  }
}

/**
 * delete POST
 */
module.exports.deletePost = async (req, res, next) => {
  try {
    await User.findOne({ username: req.session.user.username }).then(async user => {
      user.snippets.id(req.body.id).remove()
      await user.save()
    })
    req.session.flash = { type: 'success', text: 'Snippet was removed successfully.' }
    res.redirect('/account')
  } catch (error) {
    next(error)
  }
}
/**
 * edit GET
 */
module.exports.edit = async (req, res, next) => {
  try {
    const user = await User.findOne({ 'snippets._id': req.params.id }, { snippets: { $elemMatch: { _id: req.params.id } } })
    const content = {
      id: user.snippets[0]._id,
      tags: user.snippets[0].tags,
      snippet: user.snippets[0].snippet
    }
    res.render('account/edit', { user, content })
  } catch (error) {
    next(error)
  }
}

/**
 * edit POST
 */
module.exports.editPost = async (req, res, next) => {
  try {
    await User.updateOne({ username: req.session.user.username, 'snippets._id': req.body.id }, {
      $set: {
        'snippets.$.tags': req.body.tags.split(','),
        'snippets.$.snippet': req.body.snippet
      } })
    req.session.flash = { type: 'success', text: 'Snippet was edited successfully.' }
    res.redirect('/account')
  } catch (error) {
    next(error)
  }
}
