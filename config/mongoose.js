const mongoose = require('mongoose')
const env = require('dotenv')

env.load({ path: '.env' })

const CONNECTION_STRING = process.env.MONGODB_URI

module.exports.connect = async () => {
  mongoose.connection.on('connected', () => console.log('Mongoose connection is open.'))
  mongoose.connection.on('error', err => console.error(`Mongoose connection error has occurred: ${err}`))
  mongoose.connection.on('disconnected', () => console.log('Mongoose connection is disconnected.'))
  // If the Node process ends, close the Mongoose connection.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is disconnected due to application termination.')
      process.exit(0)
    })
  })
  // Connect to the server.
  mongoose.set('useCreateIndex', true)
  mongoose.set('useNewUrlParser', true)
  return mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true })
}
