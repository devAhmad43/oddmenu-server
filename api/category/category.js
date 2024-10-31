// routes/categoryRoutes.js
const express = require("express");
const Category = require("../../models/category"); // Adjust the path as needed

const router = express.Router();

// Create a new category
router.post("/createCategory", async (req, res) => {
    const { name } = req.body;
    try {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists." });
        }
        const category = new Category({ name });
        await category.save();
        res.status(201).json({ message: "Category created successfully.", category: category });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
// Get all categories
router.get("/getCategories", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ message: "Categories retrieved successfully.", categories: categories });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

// Get a category by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }
        res.status(200).json({ message: "Category retrieved successfully.", category });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

// Update a category
router.put("/update/:categoryId", async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name },
            { new: true, runValidators: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found." });
        }
        res.status(200).json({ message: "Category updated successfully.", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

// Delete a category
router.delete("/delete/:categoryId", async (req, res) => {
    const { categoryId } = req.params;
    try {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found." });
        }
        res.status(200).json({ message: "Category deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

module.exports = router;
