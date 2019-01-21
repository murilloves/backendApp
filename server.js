const express = require('express')
const mongoose = require('mongoose')

const backendApp = express()

// DB Config
const dbConfig = require('./config/keys').mongoURI

// Connect to MongoDB
mongoose
  .connect(dbConfig)
  .then(() => console.log('Connected successfully to ***musicial*** MongoDB'))
  .catch(err => console.log(err))

backendApp.get('/', (req, res) => res.send('Hello, Musicial!!!'))

const port = process.env.PORT || 5000

backendApp.listen(port, () => console.log(`\nServer running on port ${port}`))
