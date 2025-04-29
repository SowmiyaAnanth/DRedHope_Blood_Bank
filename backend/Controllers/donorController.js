const Donor = require("../Models/donorModel");
const path = require("path");
const fs = require("fs");

exports.createDonor = async (req, res) => {
  try {
    const donorData = JSON.parse(req.body.data);
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    const newDonor = new Donor({ ...donorData, image: imagePath });
    await newDonor.save();
    res.status(201).json(newDonor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    const donorData = JSON.parse(req.body.data || "{}");
    console.log("➡️ Updating Donor ID:", req.params.id);
    console.log("📦 Incoming Data:", donorData);
    console.log("📷 Image file:", req.file);


    if (req.file) {
      if (donor.image) {
        const oldImagePath = path.join(__dirname, "..", donor.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      donorData.image = `/uploads/${req.file.filename}`;
    } else {
      donorData.image = donor.image;
    }

    const updatedDonor = await Donor.findByIdAndUpdate(req.params.id, donorData, { new: true });
    res.json(updatedDonor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    if (donor.image) {
      const imagePath = path.join(__dirname, "..", donor.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Donor.findByIdAndDelete(req.params.id);
    res.json({ message: "Donor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
