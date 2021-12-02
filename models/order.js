const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new mongoose.Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    foods: [{
        type: Schema.Types.ObjectId,
        ref: 'Food',
        required: true
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)