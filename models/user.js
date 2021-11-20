const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    phoneNumber: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        validate: [ validator.isEmail, 'Invalid email' ]
    },
    password: {
        type: String,
        required: true,
        select: false
    },
})

module.exports = mongoose.model('User', userSchema)