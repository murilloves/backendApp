const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const posts = require('./routes/api/posts')
const profile = require('./routes/api/profile')
const users = require('./routes/api/users')
const playlists = require('./routes/api/playlists')

// Init cors and config
const cors = require('cors')

// Instantianting the express backend main var
const backendApp = express()

// Body parser middleware
backendApp.use(bodyParser.urlencoded({extended: false}))
backendApp.use(bodyParser.json())
backendApp.use(cors({
  origin: '*'
}))

// DB Config
const dbConfig = require('./config/keys').mongoURI

// Connect to MongoDB
mongoose
  .connect(dbConfig)
  .then(() => console.log('Connected successfully to ***musicial*** MongoDB'))
  .catch(err => console.log(err))

// backendApp.get('/', (req, res) => res.send('Hello, Musicial!!!'))

// Passport Middleware
backendApp.use(passport.initialize())

// Passport Config
require('./config/passport')(passport)

// Use Routes
backendApp.use('/api/posts', posts)
backendApp.use('/api/profile', profile)
backendApp.use('/api/users', users)
backendApp.use('/api/playlists', playlists)

<<<<<<< HEAD
backendApp.listen(process.env.PORT || 5000, () => console.log(`\nServer running on port 5000`))
=======
backendApp.listen(process.env.PORT || 5000, () => console.log(`\nServer running`))
>>>>>>> dc21d64b6f8fc4d7ca9d5903db5c0ba3f54dd76f
