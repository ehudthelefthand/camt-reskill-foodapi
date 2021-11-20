const express = require('express')
const asyncHandler = require('express-async-handler')
const Food = require('../models/food')
const Order = require('../models/order')
const auth = require('../middlewares/auth')

const router = express.Router()

router.post('/', auth, asyncHandler(async (req, res, next) => {
    const { foodIds } = req.body
    
    const foods = await Food.find({ _id: { $in: foodIds } }).exec()
    if (foods.length === 0) {
        res.sendStatus(422)    
        return
    }

    const user = req.User
    await Order.create({
        customer: user._id,
        foods: foods.map(f => f._id )
    })
    
    res.sendStatus(201)
}))

router.get('/', auth, asyncHandler(async (req, res, next) => {
    const user = req.User
    const orders = await Order
        .find({ customer: user._id })
        .populate('customer')
        .populate('food')
        .exec()
    
    res.json(orders)
}))

module.exports = router