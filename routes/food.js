const express = require('express')
const asyncHandler = require('express-async-handler')
const Food = require('../models/food')

const router = express.Router()

router.get('/', asyncHandler(async (req, res, next) => {
    if (req.query.offset && req.query.limit) {
        const offset = Number(req.query.offset)
        const limit = Number(req.query.limit)
        const foods = await Food.find()
            .skip(offset * limit)
            .limit(limit)
            .exec()
        const total = await Food.count().exec()
        res.json({
            data: foods.map(food => ({ ...food.toJSON(), photo: `/foods/${food.photo}` })),
            total
        })
    } else {
        const foods = await Food.find().exec()
        res.json(foods.map(food => ({ ...food.toJSON(), photo: `/foods/${food.photo}` })))
    }
    
}))

module.exports = router