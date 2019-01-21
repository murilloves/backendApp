const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')

// Load User model
const UserModel = require('../../models/User')

// @route   GET api/users/test
// @desc    Tests Users route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Users works'}))

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  UserModel
    .findOne({ email: req.body.email })
    .then(user => {
      if(user) {
        return res.status(400).json({ email: 'Email already exists'})
      } else {

        // Get the gravatar from email if it exists
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        })

        // Receive the user register props
        const newUser = new UserModel({
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          password: req.body.password
        })

        // Generate the hash password from raw and Save in DB
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) { throw err }
            newUser.password = hash
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          })
        })
      }
    })
})

module.exports = router
