const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const cartSchema = mongoose.Schema({
    products: {
        type: Object,
    },
    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },

}, { timestamps: true })

module.exports = mongoose.model('Cart', cartSchema);