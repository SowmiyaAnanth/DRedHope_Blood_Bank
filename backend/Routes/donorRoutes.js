const express = require('express');
const router = express.Router();
const donorController = require("../Controllers/donorController");
const multer = require("multer");
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// Routes
router.post("/", upload.single("image"), donorController.createDonor);
router.get("/", donorController.getAllDonors);
router.get("/:id", donorController.getDonorById);
router.put("/:id", upload.single("image"), donorController.updateDonor);
router.delete("/:id", donorController.deleteDonor);

module.exports = router;
