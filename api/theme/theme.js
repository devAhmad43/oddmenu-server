// Backend (Node.js/Express)
const express = require('express');
const router = express.Router();
const Theme = require('../../models/theme');

// Route to save or update theme color for a specific admin
router.post('/createtheme/:id', async (req, res) => {
    const { color } = req.body;
    console.log("colors",color)
    const { id } = req.params;

    try {
        // Save or update the admin's theme color in the database
        const theme = await Theme.findOneAndUpdate(
            { id },
            { themeColor: color },
            { new: true, upsert: true, setDefaultsOnInsert: true } // upsert: create if not exists
        );

        res.status(200).json({ message: 'Theme color saved successfully', color: theme.themeColor });
    } catch (error) {
        console.error('Error saving theme color:', error);
        res.status(500).json({ error: 'Failed to save theme color' });
    }
});

// Route to get the theme color for a specific admin
router.get('/gettheme/:id', async (req, res) => {
    const {  id } = req.params;
    try {
        const theme = await Theme.findOne({ id });

        if (!theme) {
            return res.status(404).json({ error: 'Theme color not found for the specified admin' });
        }

        res.status(200).json({ color: theme.themeColor });
    } catch (error) {
        console.error('Error retrieving theme color:', error);
        res.status(500).json({ error: 'Failed to retrieve theme color' });
    }
});

module.exports = router;
