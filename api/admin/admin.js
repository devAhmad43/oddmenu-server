const express = require("express");
const router = express.Router();
const AdminPanel = require("../../models/adminModel");
const jwt = require("jsonwebtoken");
const secretIDAdmin = process.env.secret_ID_Admin;
// Admin Login
router.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const admin = await AdminPanel.findOne({ adminemail: email,  });
    if (!admin) {
      return res
        .status(401)
        .json({ message: "Admin not found", userstatus: 0 });
    }
    if (admin.isBlocked) {
      return res.status(403).json({ message: "Access denied. Admin is blocked." });
    }
    if (!admin.isverified) {
      return res.status(401).json({ message: "Admin is not verified" });
    }
    if (admin.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    jwt.sign(
      { id: admin._id, role: "admin" }, // Add role to the token payload
      secretIDAdmin,
      { expiresIn: 12 * 60 * 60 }, // 12 hours
      async (err, UserToken) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Failed to generate token" });
        }
        admin.sessionExpiration = new Date().getTime() + 12 * 60 * 60 * 1000;
        admin.jwtadmintoken = UserToken;
        await admin.save();
        res.status(200).json({ message: "Successfully Signed In", admin });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to Sign-In, try Again Later",
      error: error.message,
    });
  }
});
// Admin Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const existingAdmin = await AdminPanel.findOne({ adminemail: email,  });
    if (existingAdmin) {
      return res.status(401).json({ message: "Admin already exists" });
    }
    const newAdmin = new AdminPanel({
      adminemail: email,
      password: password,
      isverified: true,
      role: "admin" // Assign role in the database
    });
    console.log("newAdmin", newAdmin);
    jwt.sign(
      { id: newAdmin._id, role: "admin" }, // Add role to the token payload
      secretIDAdmin,
      { expiresIn: 12 * 60 * 60 }, // 12 hours
      async (err, userToken) => {
        if (err) {
          console.log("error", err);
          return res
            .status(500)
            .json({ message: "Failed to generate token" });
        }
        newAdmin.jwtadmintoken = userToken;
        newAdmin.sessionExpiration = new Date().getTime() + 12 * 60 * 60 * 1000;
        await newAdmin.save();
        res
          .status(200)
          .json({ message: "Admin successfully signed up", admin: newAdmin });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to sign up admin, try again later",
      error: error.message,
    });
  }
});

module.exports = router;
