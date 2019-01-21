const express = require('express')
const mongoose = require('mongoose')

const posts = require('./routes/api/posts')
const profile = require('./routes/api/profile')
const users = require('./routes/api/users')

// Instantianting the express backend main var
const backendApp = express()

// DB Config
const dbConfig = require('./config/keys').mongoURI

// Connect to MongoDB
mongoose
  .connect(dbConfig)
  .then(() => console.log('Connected successfully to ***musicial*** MongoDB'))
  .catch(err => console.log(err))

backendApp.get('/', (req, res) => res.send('Hello, Musicial!!!'))

// Use Routes
backendApp.use('/api/posts', posts)
backendApp.use('/api/profile', profile)
backendApp.use('/api/users', users)

const port = process.env.PORT || 5000

backendApp.listen(port, () => console.log(`\nServer running on port ${port}`))
