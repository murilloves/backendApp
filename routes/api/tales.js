const express = require('express')
const router = express.Router()

const Validator = require('validator')
const isEmpty = require('../../validation/is-empty')


// Load Access Model
const AccessModel = require('../../models/Access')

// Load Tales Model
const TalesModel = require('../../models/Tales')

const validateTaleInput = (data) => {
    let errors = {}

    data.text = !isEmpty(data.text) ? data.text : ''
    data.title = !isEmpty(data.title) ? data.title : ''

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Title is required'
    }

    if (Validator.isEmpty(data.text)) {
        errors.text = 'Text field\'s required'
    }

    if (denyAccess(data.password)) {
        errors.password = 'Password doesn\'t macth'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
const denyAccess = (access) => {
  return access !== 'gnomo420';
}

// @route   GET api/tales/test
// @desc    Tests Tales route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Tales works'}))

// @route   GET api/tales/all
// @desc    Get all Tales
// @access  Public
router.get('/all', (req, res) => {
    // Returning Tales
    TalesModel
        .find()
        .sort({date: 'desc'})
        .then(tales => {
            res.status(200).json(tales)
        })
});

// @route   POST api/tales/all
// @desc    Get all Tales
// @access  Public
router.post('/all', (req, res) => {
    if (req.body.count_access) {
        const newAccess = AccessModel({
            minicontos_website: {
                access_date: new Date(),
                ip_addr: req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null)
            }
        })
        newAccess.save().then(response => console.log(response));
    }

    // Returning Tales
    TalesModel
        .find()
        .sort({date: 'desc'})
        .then(tales => {
            if (req.body.get_accesses_number) {
                // Returning Accesses number also
                AccessModel.countDocuments().then(result => {
                    let accesses = { quantity: result };
                    res.status(200).json({tales, accesses})
                });
            } else {
                res.status(200).json(tales)
            }
        })
});

// @route   POST api/tales/register
// @desc    Register Tale
// @access  Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateTaleInput(req.body)

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors)
    }

    // Receive the tale register props
    const newTale = TalesModel({
        text: req.body.text,
        title: req.body.title,
        date: new Date()
    })

    // Save tale in DB
    newTale
        .save()
        .then(tale => res.json(tale))
        .catch(err => console.log(err))
});

// @route   DELETE api/tales/:id
// @desc    Delete tale
// @access  Public
router.delete('/:id/:access', (req, res) => {
    if (denyAccess(req.params.access)) {
        return res.status(401).json('Access Denied.')
    }

    TalesModel.findById(req.params.id)
        .then(tale => {
            tale.remove().then(() => res.json({ success: true, msg: `tale "${tale.title}" deleted successfully` }))
        })
        .catch(err => res.status(404).json({ taleNotFound: 'Can\'t remove if the tale DOESN\'T EXISTS)' }))
})


module.exports = router
