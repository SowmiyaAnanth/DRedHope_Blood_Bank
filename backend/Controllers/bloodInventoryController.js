const BloodInventory = require("../Models/bloodInventoryModel");

// Get all inventory
exports.getAllInventory = async (req, res) => {
  try {
    const data = await BloodInventory.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Add new inventory
exports.createInventory = async (req, res) => {
  try {
    const newRecord = new BloodInventory(req.body);
    const saved = await newRecord.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Invalid data", details: err.message });
  }
};

// Update inventory
exports.updateInventory = async (req, res) => {
  try {
    const updated = await BloodInventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid data", details: err.message });
  }
};

// Delete inventory
exports.deleteInventory = async (req, res) => {
  try {
    const deleted = await BloodInventory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
