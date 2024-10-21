const express = require("express");
const router = express.Router();
const Products = require("../../models/products");

router.post("/createProduct", async (req, res) => {
  const { title, description, price, imageUrl, producttype, admin } =
    req.body;
  try {
    const data = new Products({
      admin,
      title,
      price,
      imageUrl,
      description,
      producttype,
    });
    await data.save();
    res.status(200).json({ message: "Product add successfully", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", errors: error.message });
  }
});
router.get("/getProducts/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;  // Get the adminId from the request parameters
    console.log("Admin ID:", adminId);  // Log the adminId for debugging
    // Check if adminId exists
    if (!adminId) {
      return res.status(404).json({ message: "Admin ID not provided" });
    }
    // Find products by adminId
    const products = await Products.find({ admin: adminId });

    // Check if products were found
    if (!products.length) {
      return res.status(404).json({ message: "No products found for this admin" });
    }
    // Send the products in the response
    res.status(200).json({ message: req.params.table, products,});
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});
router.get("/getsingleProduct/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let finddata = await Products.findById(id);
    if (!finddata) {
      return res.status(400).json({ message: "product not found" });
    }
    res.status(200).json({ finddata, message: "data fetch successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ errors: error.message, message: "Internal server error" });
  }
});
router.put("/updateProduct/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price, description, imageUrl, producttype } = req.body;
  try {
    const data = await Products.findOne({ _id: id });
    if (!data) {
      return res.status(400).json({ message: "item not found" });
    }
    if (title) {
      data.title = title;
    }
    if (price) {
      data.price = price;
    }
    if (imageUrl) {
      data.imageUrl = imageUrl;
    }
    if (description) {
      data.description = description;
    }
    if (producttype) {
      data.producttype = producttype;
    }
    await data.save();
    res.status(200).json({ message: "Product successfully updated", data });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/deleteProduct/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let data = await Products.findOne({ _id: id });
    if (!data) {
      return res.status(400).json({ message: " no item found" });
    }
    data = await Products.findByIdAndDelete(id);
    res.status(200).json({ message: "item successfully deleted", data });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/updateStatus/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const data = await Products.findOne({ _id: id });
    if (!data) {
      return res.status(400).json({ message: "item not found" });
    }
    data.status = status;
    await data.save();
    res
      .status(200)
      .json({ message: "Product status successfully updated", data });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
