const mongoose = require('mongoose');

// Define the Verification schema
const AdminPanelSchema = new mongoose.Schema({
    adminemail: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
    type: String,
    enum: ["admin", "superadmin"], // Define the roles
    default: "admin",              // Default is admin
  },
    isBlocked: {
        type: Boolean,
        default: false,                // Super admin can toggle this
      },
    isverified: {
        type: Boolean,
       default:false,
    },
    jwtadmintoken: {
        type: String,
    },
    sessionExpiration: {
        type: String,
    },

});

// Create the Verification model
const AdminPanel = mongoose.model('AdminPanel', AdminPanelSchema);

module.exports = AdminPanel;
