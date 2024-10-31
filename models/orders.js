let mongoose = require('mongoose');
let orderSchema = mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminPanel',
  },
  product: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Product collection
      ref: 'Product',
    },
  }],
  noofitems: {
    type: String,
  },
  tableNumber:{
    type:Number 
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