const mongoose = require("mongoose");

const bloodInventorySchema = new mongoose.Schema(
  {
    donorID: { type: String, required: true },
    collectionDate: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: String, required: true },
    storageLocation: { type: String, required: true },
    collectedBy: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BloodInventory", bloodInventorySchema);
