const express = require('express');
const router = express.Router();
const Image = require('../../models/logo');

// POST: Add or replace an image for a specific admin by ownerId
router.post('/upload-image/:ownerId', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const { ownerId } = req.params;
    
    if (!imageUrl || !ownerId) {
      return res.status(400).json({ message: 'Image URL and owner ID are required' });
    }
    // Check if an image already exists for this ownerId
    const existingImage = await Image.findOne({ ownerId });
    if (existingImage) {
      // Update the existing image URL
      existingImage.imageUrl = imageUrl;
      await existingImage.save();
      return res.status(200).json({ message: 'Image URL updated successfully', data: existingImage });
    }
    // Create a new image document if none exists
    const newImage = new Image({
      imageUrl,
      id:ownerId
    });
    await newImage.save();
    return res.status(201).json({ message: 'Image URL stored successfully', data: newImage });
  } catch (error) {
    res.status(500).json({ message: 'Server error while uploading image', error: error.message });
  }
});
// GET: Retrieve the image for a specific admin by ownerId
router.get('/logo/:ownerId', async (req, res) => {
    try {
      const { ownerId } = req.params;
  
      // Retrieve the last image saved for the given ownerId
      const image = await Image.findOne({ id: ownerId })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .exec();
  
      if (!image) {
        return res.status(404).json({ message: 'No image found for this owner' });
      }
  
      res.status(200).json({ data: image });
    } catch (error) {
      res.status(500).json({ message: 'Server error while retrieving image', error: error.message });
    }
  });
  

// GET: Retrieve a single image by image ID
router.get('/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.status(200).json({ data: image });
  } catch (error) {
    res.status(500).json({ message: 'Server error while retrieving image by ID', error: error.message });
  }
});

module.exports = router;
