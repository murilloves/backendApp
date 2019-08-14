const mongoose = require ('mongoose')
const Schema = mongoose.Schema

// Create Schema
const AccessSchema = new Schema({
  minicontos_website: {
    access_date: {
      type: Date
    },
    ip_addr: {
      type: String
    }
  },
})

module.exports = User = mongoose.model('access', AccessSchema)
