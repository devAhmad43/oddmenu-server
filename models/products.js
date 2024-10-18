const mongoose = require('mongoose');

let ProductSchema = mongoose.Schema({
    producttype: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
    title: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false,
    },
    // Reference to the AdminPanel schema
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminPanel', // This should match the model name of the AdminPanel
        required: true, // If every product must be associated with an admin
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema); // Use 'Product' as the model name
