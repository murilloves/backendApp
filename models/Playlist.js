const mongoose = require ('mongoose')
const Schema = mongoose.Schema

// Create Schema
const PlaylistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  playlistName: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  songs: [
    {
      title: {
        type: String,
        required: true
      },
      key: {
        type: String
      },
      author: {
        type: String
      },
      desc: {
        type: String
      }
    }
  ]
})

module.exports = User = mongoose.model('playlists', PlaylistSchema)
