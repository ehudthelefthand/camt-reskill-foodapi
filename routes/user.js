const express = require('express')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = require('../middlewares/auth')

const SECRET = process.env.SECRET || 'secret'
const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || '8h'

const router = express.Router()

router.post('/register', asyncHandler(async (req, res) => {
    const { 
        email, 
        password, 
        firstname, 
        lastname,
        phoneNumber
    } = req.body
    const saltRound = 10
    const passwordHash = await bcrypt.hash(password, saltRound)
    await User.create({ 
        email, 
        password: passwordHash, 
        firstname, 
        lastname,
        phoneNumber
    })

    res.sendStatus(201)
}))

router.post('/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username }).select("+password").exec()
    if (!user) {
        res.sendStatus(401)
        return
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
        res.sendStatus(401)
        return
    }

    const token = jwt.sign({
        id: user._id,
    }, SECRET, { 
        expiresIn: TOKEN_EXPIRE
    })

    res.json({ token })
}))

router.get('/me', auth, asyncHandler(async (req, res) => {
    const { firstname, lastname } = req.User
    res.json({
        email,
        firstname, 
        lastname,
        phoneNumber,
    })
}))

router.put('/me', auth, asyncHandler(async (req, res) => {

}))

module.exports = router