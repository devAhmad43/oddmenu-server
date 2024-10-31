// models/Admin.js
const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema({
  themeColor: {
    type: String,
    default: '##E460E6', // Default color if none is set
  },
  id:{
    type: String,
  }
  // Add other fields if needed
}, { timestamps: true });

module.exports = mongoose.model('Theme', ThemeSchema);
