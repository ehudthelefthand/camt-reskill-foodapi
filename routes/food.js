const express = require('express')
const asyncHandler = require('express-async-handler')
const Food = require('../models/food')

const router = express.Router()

router.get('/', asyncHandler(async (req, res, next) => {
    const foods = await Food.find()
    res.json(foods)
}))

module.exports = router