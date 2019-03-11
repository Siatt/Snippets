const express = require('express')
const app = express()
const path = require('path')
const hbs = require('express-hbs')
const port = process.env.PORT || 8000
const mongoose = require('./config/mongoose')
const helmet = require('helmet')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const https = require('https')
const fs = require('fs')
// const csrf = require('csurf')
const expressValidator = require('express-validator')

mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})
// Serve static files
app.use(express.static(path.join(__dirname, 'public')))

// Set default hbs layout
app.engine('hbs', hbs.express3({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))

app.use(session({
  key: 'user_id',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  }
}))
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'stackpath.bootstrapcdn.com', 'fonts.googleapis.com', 'cdnjs.cloudflare.com', 'fonts.gstatic.com', 'netdna.bootstrapcdn.com'],
    scriptSrc: ["'self'", "'unsafe-inline'", 'stackpath.bootstrapcdn.com', 'cdnjs.cloudflare.com', 'use.fontawesome.com', 'code.jquery.com', 'netdna.bootstrapcdn.com'],
    fontSrc: ["'self'", 'fonts.gstatic.com'],
    objectSrc: ["'none'"]
  }
}))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views/pages'))

// Middlewares
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(helmet())
app.use(expressValidator())
// app.use(csrf({ cookie: true }))

app.use((req, res, next) => {
  // flash messages - survives only a round trip
  res.locals.flash = req.session.flash
  delete req.session.flash

  next()
})
// Routes
app.use('/', require('./routes/home'))
app.use('/account', require('./routes/account'))
app.use('/login', require('./routes/login'))
app.use('/signup', require('./routes/singup'))
app.use((req, res, next) => { // catch 404 (ALWAYS keep this as the last route)
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
// Error handler.
app.use((err, req, res, next) => {
  // 404 Not Found.
  // if (err.status === 404) {
  //   return res.status(404).sendFile(path.join(__dirname, 'views', 'pages', 'error', '404.html'))
  // }

  // // 500 Internal Server Error (in production, all other errors send this response).
  // if (req.app.get('env') === 'development') {
  //   return res.status(500).sendFile(path.join(__dirname, 'views', 'error', '500.html'))
  // }

  // Development only!
  // Set locals, only providing error in development.
  res.locals.error = err
  // Render the error page.
  res.status(err.status || 500).render('error/error', { err })
})

// For https
// https.createServer({
//   key: fs.readFileSync('./config/sslcerts/key.pem'),
//   cert: fs.readFileSync('./config/sslcerts/cert.pem')
// }, app).listen(port, () => { console.log(`running on https:localhost:${port}`) })
app.listen(port, () => { console.log(`running on https:localhost:${port}`) })
