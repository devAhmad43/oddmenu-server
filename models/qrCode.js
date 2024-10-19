const mongoose = require('mongoose');
const qrCodeSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminPanel', // Reference to the Admin
    required: true,
  },
  tableNumber: {
    type: Number,
    required: true,
  },
  qrCodeUrl: {
    type: String, // Store the base64 URL of the QR code
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('QRCode', qrCodeSchema);
