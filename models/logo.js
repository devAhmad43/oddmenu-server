// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
//   description: { //for slogan 
//     type: String,
//     required: false,
//   },
  id: {
    type: String ,// Assuming ownerId refers to the admin's MongoDB ID
    required: true,
   // Name of the referenced model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Image', imageSchema);
