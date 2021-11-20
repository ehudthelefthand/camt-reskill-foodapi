const express = require('express')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const User = require('../models/user')
const auth = require('../middlewares/auth')

const SECRET = process.env.SECRET || 'secret'
const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || '8h'

const router = express.Router()
const AVATAR_PATH = 'images/avatars/'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, AVATAR_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`)
    },
})
const upload = multer({ 
    storage, 
    limits: {
        fileSize: 1000 * 1000 * 2 // 2 MB
    }
})

router.post('/register', upload.single('avatar'), asyncHandler(async (req, res) => {
    const { 
        email,
        password, 
        firstname, 
        lastname,
        phoneNumber
    } = req.body
    const saltRound = 10
    const passwordHash = await bcrypt.hash(password, saltRound)
    const user = new User({ 
        email, 
        password: passwordHash, 
        firstname, 
        lastname,
        phoneNumber,
    })

    if (req.file && req.file.filename) {
        user.avatar = req.file.filename
    }

    await user.save()

    res.sendStatus(201)
}))

router.post('/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ email: username }).select("+password").exec()
    console.log(user)
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
    const { firstname, lastname, email, phoneNumber, avatar } = req.User
    const profile = { firstname, lastname, email, phoneNumber }
    if (avatar) {
        profile.avatar = `/avatars/${avatar}`
    }
    res.json(profile)
}))

router.put('/me', auth, asyncHandler(async (req, res) => {
    const user = req.User
    const { firstname, lastname, phoneNumber } = req.body
    if (firstname) {
        user.firstname = firstname
    }
    if (lastname) {
        user.firstname = lastname
    }
    if (phoneNumber) {
        user.phoneNumber = phoneNumber
    }
    await user.save()
    res.sendStatus(204)
}))

router.put('/me/avatar', auth, upload.single('avatar'), asyncHandler(async (req, res) => {
    const user = req.User
    if (req.file && req.file.filename) {
        const oldfilename = user.avatar
        user.avatar = req.file.filename
        await user.save()
        if (oldfilename) {
            fs.unlinkSync(path.resolve(__dirname, '..', AVATAR_PATH, oldfilename))
        }
    }
    res.sendStatus(204)
}))

module.exports = router