let mongoose = require('mongoose');
let productdetail = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipmentproduct',
  },
  orderStatus: {
    type: String
  },
  orderId: {
    type: String
  },
  productprice: {
    type: String
  },
  title: {
    type: String,
  },
  power: {
    type: String
  },
  machines: {
    type: String
  },
  hostingfee: {
    type: String
  },
});
let orderSchema = mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminPanel',
    required: true
  },
  product: [productdetail],
  noofitems: {
    type: String,
  },
  price: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });
module.exports = mongoose.model('productorder', orderSchema);