const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const orderSchema = mongoose.Schema({
    products: {
        type: Array,
        default: []
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    town: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        maxlength: 3000
    },
    postalCode: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    totalPrice: {
        type: Number,
    },

    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
}
    , { timestamps: true })

module.exports = mongoose.model('Order', orderSchema);