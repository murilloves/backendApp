const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
    let errors = {}

    data.name = !isEmpty(data.name) ? data.name : ''
    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''
    data.passwordConfirm = !isEmpty(data.passwordConfirm) ? data.passwordConfirm : ''

    if (!Validator.isLength(data.name, {min: 2, max: 30})) {
        errors.name = 'Name must be between 2 and 30 characters'
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name field\'s required'
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field\'s required'
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid'
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field\'s required'
    }

    if (!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.name = 'Password must be at least 6 characters'
    }

    if (Validator.isEmpty(data.passwordConfirm)) {
        errors.passwordConfirm = 'Password confirmation field\'s required'
    }

    if (!Validator.equals(data.password, data.passwordConfirm)) {
        errors.passwordConfirm = 'Passwords must match'
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}
