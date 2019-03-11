const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const SnippetSchema = new mongoose.Schema({
  tags: [],
  snippet: {
    type: String,
    required: true,
    minlength: 1
  }
})
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 1
  },
  password: {
    type: String,
    required: true,
    minlength: 1
  },
  date: {
    type: Date,
    required: true
  },
  snippets: [SnippetSchema]
})

UserSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) return next()
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) next(err)
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) next(err)
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function (candidatePasword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePasword, this.password, (err, isMatch) => {
      if (err) reject(err)
      resolve(isMatch)
    })
  })
}

const User = mongoose.model('User', UserSchema)

module.exports = User
