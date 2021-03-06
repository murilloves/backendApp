const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load Validation
const validateProfileInput = require('../../validation/profile')
const validateEducationInput = require('../../validation/education')
const validateExperienceInput = require('../../validation/experience')

// Load Profile Model
const ProfileModel = require('../../models/Profile')
// Load User Model
const UserModel = require('../../models/User')

const messages = {
  profile: {
    works: 'Profile works!',
    noProfileEncountered: 'There is no profile for this user'
  }
}


// @route   GET api/profile/test
// @desc    Tests Profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: messages.profile.works }))


// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    ProfileModel.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = messages.profile.noProfileEncountered
          return res.status(400).json(errors)
        }
        res.json(profile)
      })
      .catch(err => res.status(404).json(err))
  }
)


// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  ProfileModel.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles'
        return res.status(404).json(errors)
      }

      res.json(profiles)
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles'}))
})


// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {}

  ProfileModel.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user'
        res.status(404).json(errors)
      }

      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})


// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {}

  ProfileModel.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user ID'
        res.status(404).json(errors)
      }

      res.json(profile)
    })
    .catch(err => res.status(404).json({profile: 'There is no profile for this user'}))
})


// @route   POST api/profile
// @desc    Create or Edit user profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body)

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors)
    }

    // Get fields
    const profileFields = {}
    profileFields.user = req.user.id

    if (req.body.handle) profileFields.handle = req.body.handle
    if (req.body.company) profileFields.company = req.body.company
    if (req.body.website) profileFields.website = req.body.website
    if (req.body.location) profileFields.location = req.body.location
    if (req.body.bio) profileFields.bio = req.body.bio
    if (req.body.status) profileFields.status = req.body.status
    if (req.body.musicPlatformUsername) profileFields.musicPlatformUsername = req.body.musicPlatformUsername

    // Skills -> Split into array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',')
    }

    // Social -> 
    profileFields.social = {}
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram

    ProfileModel.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          // Update
          ProfileModel.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true}
          ).then(profile => res.json(profile))
        } else {
          // Create

          // Check if handle exists
          ProfileModel.findOne({ handle: profileFields.handle })
            .then(profile => {
              if (profile) {
                errors.handle = 'That handle already exists'
                res.status(400).json(errors)
              }

              // Save Profile
              new ProfileModel(profileFields)
                .save()
                .then( profile => res.json(profile))
            })
        }
      })
  }
)


// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body)

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors)
    }

    ProfileModel.findOne({ user: req.user.id })
      .then(profile => {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          fromDate: req.body.fromDate,
          toDate: req.body.toDate,
          current: req.body.current,
          description: req.body.description
        }

        // Add to exp array
        !profile.experience ? profile.experience = [] : null
        profile.experience.unshift(newExp)

        profile.save().then(profile => res.json(profile))
      })
  }
)


// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body)

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors)
    }

    ProfileModel.findOne({ user: req.user.id })
      .then(profile => {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldOfStudy: req.body.fieldOfStudy,
          fromDate: req.body.fromDate,
          toDate: req.body.toDate,
          current: req.body.current,
          description: req.body.description
        }

        // Add to exp array
        !profile.education ? profile.education = [] : null
        profile.education.unshift(newEdu)

        profile.save().then(profile => res.json(profile))
      })
  }
)


// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    ProfileModel.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id)

        // Splice out of array
        profile.experience.splice(removeIndex, 1)

        // Save the new array
        profile.save()
          .then(profile => res.json(profile))
          .catch(err => releaseEvents.status(404).json(err))
      })
  }
)


// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    ProfileModel.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id)

        // Splice out of array
        profile.education.splice(removeIndex, 1)

        // Save the new array
        profile.save()
          .then(profile => res.json(profile))
          .catch(err => releaseEvents.status(404).json(err))
      })
  }
)


// @route   DELETE api/profile/:profile_id
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    ProfileModel.findOneAndRemove({ user: req.user.id })
      .then(() => {
        UserModel.findOneAndRemove({ _id: req.user.id })
          .then(() => {
            res.json({ success: true })
          })
      })
  }
)

module.exports = router
