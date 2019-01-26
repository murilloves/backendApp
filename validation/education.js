const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateExperienceInput(data) {
    let errors = {}

    data.school = !isEmpty(data.school) ? data.school : ''
    data.degree = !isEmpty(data.degree) ? data.degree : ''
    data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : ''
    data.fromDate = !isEmpty(data.fromDate) ? data.fromDate : ''

    if (Validator.isEmpty(data.school)) {
        errors.school = 'School field is required'
    }

    if (Validator.isEmpty(data.degree)) {
        errors.degree = 'Degree field is required'
    }

    if (Validator.isEmpty(data.fieldOfStudy)) {
        errors.fieldOfStudy = 'Field of study is required'
    }

    if (Validator.isEmpty(data.fromDate)) {
        errors.fromDate = 'From date is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
