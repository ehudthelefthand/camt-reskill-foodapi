const express = require('express')
const asyncHandler = require('express-async-handler')
const Food = require('../models/food')

const router = express.Router()

router.get('/', asyncHandler(async (req, res, next) => {
    let query = Food.find()
    if (req.query.offset && req.query.limit) {
        const offset = Number(req.query.offset)
        const limit = Number(req.query.limit)
        query = query.skip(offset * limit).limit(limit)
    }
    const foods = await query.exec()
    res.json(foods.map(food => ({ ...food.toJSON(), photo: `/foods/${food.photo}` })))
}))

module.exports = router