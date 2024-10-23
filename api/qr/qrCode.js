const express = require('express');
const QRCodeModel = require('../../models/qrCode'); // Import your QRCode Mongoose model
const router = express.Router();

// POST route to generate and store a QR Code
router.post('/generateQRCode', async (req, res) => {
  const { admin, tableNumber, qrCodeUrl } = req.body;
  try {
    // Create a new QR Code document and save to the database
    const newQRCode = new QRCodeModel({
      adminId: admin, // Admin ID passed from the request
      tableNumber: tableNumber, // Table number
      qrCodeUrl: qrCodeUrl, // Generated QR Code image URL from Cloudinary
    });
    await newQRCode.save(); // Save the QR code to the database

    // Respond with the generated QR code URL
    res.status(200).json({ qrCodeUrl });
  } catch (error) {
    console.error('QR Code generation failed:', error);
    res.status(500).json({ message: 'QR Code generation failed', error });
  }
});

// GET route to retrieve all QR Codes for a specific admin from the database
router.get('/getQRCode/:adminId', async (req, res) => {
  const { adminId } = req.params; // Get adminId from the request parameters
  try {
    // Find all QR code documents based on adminId
    const qrCodeData = await QRCodeModel.find({ adminId: adminId });
    if (qrCodeData.length === 0) {
      return res.status(404).json({ message: 'No QR Codes found for the provided adminId' });
    }
    // If found, send the QR code data
    res.status(200).json(qrCodeData); // Send all QR code data
  } catch (error) {
    console.error('Failed to retrieve QR Codes:', error);
    res.status(500).json({ message: 'Failed to retrieve QR Codes', error });
  }
});
// DELETE route to delete a specific QR Code by adminId and tableNumber
router.delete('/deleteQRCode/:adminId/:tableNumber', async (req, res) => {
  const { adminId, tableNumber } = req.params; // Get adminId and tableNumber from request parameters
  try {
    // Find and delete the QR Code document based on adminId and tableNumber
    const deletedQRCode = await QRCodeModel.findOneAndDelete({ adminId: adminId, tableNumber: tableNumber });

    if (!deletedQRCode) {
      return res.status(404).json({ message: 'QR Code not found' });
    }

    // If the deletion was successful, send a success message
    res.status(200).json({ message: 'QR Code deleted successfully' });
  } catch (error) {
    console.error('Failed to delete QR Code:', error);
    res.status(500).json({ message: 'Failed to delete QR Code', error });
  }
});


module.exports = router;
