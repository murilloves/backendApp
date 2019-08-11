const mongoose = require ('mongoose')
const Schema = mongoose.Schema

// Create Schema
const TalesSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
})

module.exports = User = mongoose.model('tales', TalesSchema)
