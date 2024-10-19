const express = require("express");
const router = express.Router();
const FoodOrder = require("../../models/orders");
const Product = require("../../models/products");
///////////////////// /api/order/foodorder/////////////////////
router.post("/productorder", async (req, res) => {
  const { adminId, product, price, noofitems, table, status } = req.body;
  console.log(req.body,"ordersssss")
  try {
    const order = new FoodOrder({
      adminId: adminId, // Admin ID from the request
      noofitems: noofitems,
      price: price,
      table: table, // Table number from the request
      status: status,
      product:product // Status field from the request
    });
    // Loop through the product array to update the machines for each product and associate with the order
    // Save the new order with the associated product data
    await order.save();

    res.status(200).json({ message: "Order successfully placed", order });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

///////////////////// /api/order/getallorder /////////////////////
router.get("/getallorder/:id", async (req, res) => {
  try {
    const {id} = req.params;
    console.log("get api admin",id)
    const data = await FoodOrder.find({adminId:id});
    if (!data) {
      res.status(404).json({ message: "order not found" });
    }

    res.status(200).json({ data });
  } catch (error) {
    res.json({ message: "Internal server error" });
  }
});
///////////////////// /api/order/getorder/:id /////////////////////
router.get("/getorder/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singledata = await FoodOrder.findById(id);
    if (!singledata) {
      res.status(404).json({ message: "order not found" });
    }
    res.status(200).json({ singledata });
  } catch (error) {
    res.status(500).json({ message: "Internal sever error" });
  }
});
///////////////////// /api/order/updateitem/:id /////////////////////
router.put("/updatestatus/:id", async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    let item = await FoodOrder.findById(id);
    if (!item) {
      res.status(404).json({ message: "item not found" });
    }
    item.status = status;
    await item.save();
    res.status(200).json({ message: "Status update successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});
///////////////////// /api/order/deleteOrder/:id /////////////////////
router.delete("/deleteOrder/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let item = await FoodOrder.findById(id);
    if (!item) {
      res.status(404).json({ message: "item not found" });
    }
    item = await FoodOrder.findByIdAndDelete(id);
    res.status(200).json({ message: "item deleted successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

////////////////////////// /api/order/getUserorders ////////////
router.get("/getUserorders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await FoodOrder.find({ userId: userId });
    if (!items) {
      res.status(404).json({ message: "Orders not found" });
    }

    res.status(200).json({ message: "Orders get successfully", items });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
