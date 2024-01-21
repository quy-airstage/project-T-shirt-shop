const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name_custormer: { type: String },
    phone_custormer: { type: String },
    location_custormer: { type: String },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            size: { type: String, required: true },
            cost: { type: Number, required: true },
            quantity: { type: Number, default: 1 }
        }
    ],
    createdAt: { type: String, currentTime: () => Date.now() }

});

module.exports = mongoose.model('Order', orderSchema);

