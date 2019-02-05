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
  songs: [
    {
      title: {
        type: String,
        required: true
      },
      composer: {
        type: String
      },
      key: {
        type: String
      },
      moment: {
        type: String
      }
    }
  ]
})

module.exports = User = mongoose.model('playlists', PlaylistSchema)
