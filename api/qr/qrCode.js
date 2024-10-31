const express = require('express');
const QRCodeModel = require('../../models/qrCode'); // Update the path as necessary
const router = express.Router();

// POST route to generate and store a QR Code for both categories
router.post('/generateQRCode', async (req, res) => {
  const { admin, tableNumber, qrCodeUrl, category } = req.body;
  try {
    // Validate category input
    if (!category || !['general', 'table'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category. Must be either "general" or "table"' });
    }
    // Check if tableNumber is required for 'table' category
    if (category === 'table' && !tableNumber) {
      return res.status(400).json({ message: 'Table number is required for "table" category' });
    }

    // Create a new QR Code document and save it to the database
    const newQRCode = new QRCodeModel({
      adminId: admin,
      tableNumber: category === 'table' ? tableNumber : null,
      qrCodeUrl,
      category,
    });
    
    await newQRCode.save();

    res.status(200).json({ qrCodeUrl });
  } catch (error) {
    console.error('QR Code generation failed:', error);
    res.status(500).json({ message: 'QR Code generation failed', error });
  }
});

// GET route to retrieve all QR Codes for a specific admin from the database
router.get('/getQRCode/:adminId', async (req, res) => {
  const { adminId } = req.params;

  try {
    const qrCodeData = await QRCodeModel.find({ adminId });
    if (qrCodeData.length === 0) {
      return res.status(404).json({ message: 'No QR Codes found for the provided adminId' });
    }

    res.status(200).json(qrCodeData);
  } catch (error) {
    console.error('Failed to retrieve QR Codes:', error);
    res.status(500).json({ message: 'Failed to retrieve QR Codes', error });
  }
});

// DELETE route to delete a specific QR Code by adminId and identifier (tableNumber or 'general')
router.delete('/deleteQRCode/:adminId/:identifier', async (req, res) => {
  const { adminId, identifier } = req.params;

  try {
    let deletedQRCode;

    if (identifier === 'general') {
      deletedQRCode = await QRCodeModel.findOneAndDelete({ adminId, category: 'general' });
    } else {
      deletedQRCode = await QRCodeModel.findOneAndDelete({ adminId, tableNumber: identifier, category: 'table' });
    }

    if (!deletedQRCode) {
      return res.status(404).json({ message: 'QR Code not found' });
    }

    res.status(200).json({ message: 'QR Code deleted successfully' });
  } catch (error) {
    console.error('Failed to delete QR Code:', error);
    res.status(500).json({ message: 'Failed to delete QR Code', error });
  }
});

module.exports = router;
