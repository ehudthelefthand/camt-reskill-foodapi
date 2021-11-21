const express = require('express')
const asyncHandler = require('express-async-handler')
const Food = require('../models/food')

const router = express.Router()

router.get('/', asyncHandler(async (req, res, next) => {
    const foods = await Food.find().exec()
    res.json(foods.map(food => ({ ...food.toJSON(), photo: `/foods/${food.photo}` })))
}))

module.exports = router