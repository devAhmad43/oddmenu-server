const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, required: true },
  tableNumber: { type: String, required: false },
  qrCodeUrl: { type: String, required: true },
  category: { type: String, enum: ['general', 'table'], required: true },
}, { timestamps: true });

const QRCodeModel = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCodeModel;
