// models/categoryModel.js
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensures category names are unique
    },
}, { timestamps: true });

module.exports = mongoose.model("Category", CategorySchema);
