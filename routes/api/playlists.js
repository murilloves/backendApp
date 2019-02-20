const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Playlist Model
const PlaylistModel = require('../../models/Playlist')
const ProfileModel = require('../../models/Profile')

// Load Playlist Validators
const validatePlaylistInput = require('../../validation/playlist')

// @route   GET api/playlists/test
// @desc    Tests Playlists route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Playlists works'}))

// @route   GET api/playlists/
// @desc    Get all Playlists
// @access  Public
router.get('/', (req, res) => {
  PlaylistModel.find()
    .sort({ date: 1 })
    .then(playlists => {
      const errors = {};

      if (!playlists) {
        errors.noplaylists = 'There are no playlists'
        return res.status(404).json(errors)
      }

      res.json(playlists)
    })
    .catch(err => res.status(400).json({ playlist: 'Error fetching the playlists' }))
})


// @route   GET api/playlists/all
// @desc    Get all Playlists by user
// @access  Private
router.get('/all',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        PlaylistModel.find()
          .then(playlists => {
            const userPlaylists = []
            // Check for playlists from user owner
            for (indx in playlists) {
              if(playlists[indx].user.toString() === req.user.id.toString()) {
                userPlaylists.push(playlists[indx])
              }
            }

            res.json(userPlaylists)
          })
          .catch(err => res.status(404).json({ playlistsNotFound: 'Couldn\'t find any playlists' }))
      })
})


// @route   POST api/playlists/:id
// @desc    Add song to a playlist
// @access  Private
router.post('/:id/addSong',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        PlaylistModel.findById(req.params.id)
          .then(playlist => {
            // Check for playlist owner
            if(playlist.user.toString() !== req.user.id) {
              return res.status(401).json({ notAuthorized: 'User not authorized' })
            }

            if (!req.body.title || req.body.title.trim().length <= 2) {
              res.status(400).json({ mustHaveTitle: 'The song must have a name' })
            } else {
              const newSong = {
                title: req.body.title,
                key: req.body.key,
                author: req.body.author,
                desc: req.body.desc
              }
  
              // Add to playlist's array
              playlist.songs.push(newSong)
  
              // res.json(playlist)
              // Save the playlist
              playlist.save().then(playlist => res.json(playlist))
            }
          })
          .catch(err => res.status(404).json({ playlistNotFound: 'Couldn\'t find the playlist (it doesn\'t exist)' }))
      })
})


// @route   GET api/playlists/:id
// @desc    Get Playlist by user by id
// @access  Private
router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        PlaylistModel.findById(req.params.id)
          .then(playlist => {
            // Check for playlist owner
            if(playlist.user.toString() !== req.user.id) {
              return res.status(401).json({ notAuthorized: 'User not authorized' })
            }

            res.json(playlist)
          })
          .catch(err => res.status(404).json({ postNotFound: 'Couldn\'t find the playlist' }))
      })
})


// @route   DELETE api/playlists/:id
// @desc    Delete playlist
// @access  Private
router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        PlaylistModel.findById(req.params.id)
          .then(playlist => {
            // Check for playlist owner
            if(playlist.user.toString() !== req.user.id) {
              return res.status(401).json({ notAuthorized: 'User not authorized' })
            }

            playlist.remove().then(() => res.json({ success: true }))
          })
          .catch(err => res.status(404).json({ postNotFound: 'Couldn\'t remove the playlist (it doesn\'t exist)' }))
      })
})


// @route   POST api/playlist
// @desc    Create or edit a Playlist
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePlaylistInput(req.body)

    // Check validation
    if(!isValid) {
      // Return errors with 400 status
      return res.status(400).json(errors)
    }

    // Get fields
    const newPlaylist = new PlaylistModel({
      playlistName: req.body.playlistName,
      songs: req.body.songs,
      user: req.user.id
    });

    newPlaylist.save().then(playlist => res.json(playlist))
    // return res.status(200).json('all right')
})

module.exports = router
