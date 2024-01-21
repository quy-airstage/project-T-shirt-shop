const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id_category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name_product: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    describe: { type: String },
    sizeList: [
        {
            size: { type: String },
            inStock: { type: Number, default: 1 }
        }
    ],
    productImage: { type: String },
    productImageSub: { type: String },
    listImgProduct: [
        {
            img: { type: String },
        }
    ],
    createdAt: { type: String, currentTime: () => Date.now() }
});

module.exports = mongoose.model('Product', productSchema);