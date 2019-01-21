const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')

const messages = {
  users: {
    works: 'Users works!',
    email: 'Email already exists',
    notFound: 'Email not found',
    doesntMatch: `Email and password doesn't match!`
  },
  generic: {
    success: 'Success!!'
  }
}

// Load User model
const UserModel = require('../../models/User')

// @route   GET api/users/test
// @desc    Tests Users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: messages.users.works }))

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  UserModel
    .findOne({ email: req.body.email })
    .then(user => {
      if(user) {
        return res.status(400).json({ email: messages.users.email})
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

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  // Find user by email
  UserModel
    .findOne({email})
    .then(user => {
      // Check for user
      if (!user) {
        return res.status(404).json({ messages: messages.users.notFound })
      }

      // Check Password
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            res.json({ msg: messages.generic.success })
          } else {
            return res.status(400).json({ password: messages.users.doesntMatch })
          }
        })
    })
})

module.exports = router
