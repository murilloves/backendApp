const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validatePlaylistInput(data) {
  let errors = {}

  data.playlistName = !isEmpty(data.playlistName) ? data.playlistName : ''
  // data.songs = !isEmpty(data.playlistName) ? data.playlistName : ''

  if (Validator.isEmpty(data.playlistName)) {
    errors.playlistName = 'Playlist Name is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
