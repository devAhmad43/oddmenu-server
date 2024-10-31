const express = require("express");
const router = express.Router();
const AdminPanel = require("../../models/adminModel");
const Product = require("../../models/products");
const Order = require("../../models/orders");
const QRCode = require("../../models/qrCode"); // Assuming you have a QRCode model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretIDSuperAdmin = process.env.secret_ID_SuperAdmin;

// Super Admin Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingSuperAdmin = await AdminPanel.findOne({ adminemail: email, role: 'superadmin' });
    if (existingSuperAdmin) {
      return res.status(401).json({ message: "Super Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSuperAdmin = new AdminPanel({
      adminemail: email,
      password: hashedPassword,
      role: 'superadmin',
      isverified: true
    });
    const userToken = jwt.sign(
      { id: newSuperAdmin._id, role: 'superadmin' },
      secretIDSuperAdmin,
      { expiresIn: 60*60*12 }
    );
    newSuperAdmin.jwtadmintoken = userToken;
    await newSuperAdmin.save();
    res.status(200).json({ message: "Super Admin successfully signed up",  newSuperAdmin });
  } catch (error) {
    res.status(500).json({
      message: "Failed to sign up Super Admin",
      error: error.message,
    });
  }
});

// Super Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const superAdmin = await AdminPanel.findOne({ adminemail: email, role: 'superadmin' });
    if (!superAdmin) {
      return res.status(401).json({ message: "Super Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const userToken = jwt.sign(
      { id: superAdmin._id, role: 'superadmin' },
      secretIDSuperAdmin,
      { expiresIn: '12h' }
    );

    superAdmin.jwtadmintoken = userToken;
    await superAdmin.save();

    res.status(200).json({ message: "Successfully logged in as Super Admin", superAdmin });
  } catch (error) {
    res.status(500).json({
      message: "Failed to log in Super Admin",
      error: error.message,
    });
  }
});

// Super Admin can view all admins
router.get("/admins", async (req, res) => {
  try {
    const admins = await AdminPanel.find({ role: 'admin' }).select('-password'); // Exclude password
    res.status(200).json({ message: "admins fetch success", admins: admins });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins", error: error.message });
  }
});

// Super Admin can block/unblock admins
router.patch("/admins/:id/block", async (req, res) => {
  try {
    const admin = await AdminPanel.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.isBlocked = !admin.isBlocked; // Toggle block status
    await admin.save();
    res.status(200).json({ message: `Admin ${admin.isBlocked ? 'blocked' : 'unblocked'} successfully`, admin });
  } catch (error) {
    res.status(500).json({ message: "Failed to update admin status", error: error.message });
  }
});

// Super Admin can view all products for a specific admin
router.get("/products/:adminId", async (req, res) => {
  try {
    const products = await Product.find({ admin: req.params.adminId }); // Filter by adminId
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this admin" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

// Super Admin can view all orders for a specific admin
router.get("/orders/:adminId", async (req, res) => {
  try {
    const orders = await Order.find({ admin: req.params.adminId }); // Filter by adminId
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this admin" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

// Super Admin can view all QR codes for a specific admin
router.get("/qrcodes/:adminId", async (req, res) => {
  try {
    const qrcodes = await QRCode.find({ admin: req.params.adminId }); // Filter by adminId
    if (qrcodes.length === 0) {
      return res.status(404).json({ message: "No QR codes found for this admin" });
    }
    res.status(200).json(qrcodes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch QR codes", error: error.message });
  }
});

module.exports = router;
