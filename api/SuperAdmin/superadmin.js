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
    // Check if a super admin with the same email already exists
    const existingSuperAdmin = await AdminPanel.findOne({ adminemail: email, role: "superadmin" });
    if (existingSuperAdmin) {
      return res.status(401).json({ message: "Super Admin already exists" });
    }

    // Hash the password and create a new super admin record
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSuperAdmin = new AdminPanel({
      adminemail: email,
      password: hashedPassword,
      role: "superadmin",
      isverified: true,
    });

    // Generate a JWT token for the new super admin
    jwt.sign(
      { id: newSuperAdmin._id, role: "superadmin" },
      secretIDSuperAdmin,
      { expiresIn: "12h" }, // Token expiration time
      async (err, userToken) => {
        if (err) {
          console.error("Error generating token:", err);
          return res.status(500).json({ message: "Failed to generate token" });
        }

        // Set session expiration and save the token in the super admin's record
        newSuperAdmin.sessionExpiration = new Date().getTime() + 12 * 60 * 60 * 1000;
        newSuperAdmin.jwtadmintoken = userToken;
        await newSuperAdmin.save();

        // Respond with success message and new super admin details
        res.status(200).json({ message: "Super Admin successfully signed up", superadmin: newSuperAdmin });
      }
    );
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
    // Find the super admin with the specified email and role
    const superAdmin = await AdminPanel.findOne({ adminemail: email, role: 'superadmin' });
    if (!superAdmin) {
      return res.status(401).json({ message: "Super Admin not found", userstatus: 0 });
    }

    // Verify the super admin’s account status
    if (!superAdmin.isverified) {
      return res.status(401).json({ message: "Super Admin is not verified" });
    }

    // Check if the provided password matches the stored password
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    // Generate a JWT token for the super admin
    jwt.sign(
      { id: superAdmin._id, role: "superadmin" }, // Add role to the token payload
      secretIDSuperAdmin,
      { expiresIn: '12h' }, // Token expiration time
      async (err, userToken) => {
        if (err) {
          console.log("error", err);
          return res.status(500).json({ message: "Failed to generate token" });
        }
        // Set the session expiration and save the token in the super admin's record
        superAdmin.sessionExpiration = new Date().getTime() + 12 * 60 * 60 * 1000;
        superAdmin.jwtadmintoken = userToken;
        await superAdmin.save();
        // Respond with success message and super admin details
        res.status(200).json({ message: "Successfully logged in as Super Admin", superadmin: superAdmin });
      }
    );
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
router.post("/admins/:id/block", async (req, res) => {
  const {id}=req.params
  try {
    const admin = await AdminPanel.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    admin.isBlocked = !admin.isBlocked; // Toggle block status
    await admin.save();
    res.status(200).json({ message: `Admin ${admin.isBlocked ? 'blocked' : 'unblocked'} successfully`,admin: admin });
  } catch (error) {
    res.status(500).json({ message: "Failed to update admin status", error: error.message });
  }
});

// Super Admin can view all products for a specific admin
router.get("/products/:id", async (req, res) => {
const {id}=req.params;
  try {
    const products = await Product.find({ admin: id }); // Filter by adminId
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this admin" });
    }
    res.status(200).json({products:products});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

// Super Admin can view all orders for a specific admin
router.get("/orders/:id", async (req, res) => {
  const {id}=req.params;
  try {
    const orders = await Order.find({adminId:id}); // Filter by adminId
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this admin" });
    }
    res.status(200).json({message:"order fetch success", orders:orders});
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
