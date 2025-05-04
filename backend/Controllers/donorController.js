const Donor = require("../Models/donorModel");
const path = require("path");
const fs = require("fs");

exports.createDonor = async (req, res) => {
  try {
    const donorData = JSON.parse(req.body.data);
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Convert date strings to Date objects
    if (donorData.dateOfBirth) {
      donorData.dateOfBirth = new Date(donorData.dateOfBirth);
    }
    if (donorData.lastDonationDate) {
      donorData.lastDonationDate = new Date(donorData.lastDonationDate);
    }

    const newDonor = new Donor({ ...donorData, image: imagePath });
    await newDonor.save();
    res.status(201).json(newDonor);
  } catch (error) {
    console.error("Error creating donor:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.json(donors.map(donor => ({
      ...donor.toObject(),
      image: donor.image ? `http://localhost:5000${donor.image}` : null
    })));
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }
    const donorObj = donor.toObject();
    donorObj.image = donor.image ? `http://localhost:5000${donor.image}` : null;
    res.json(donorObj);
  } catch (error) {
    console.error("Error fetching donor:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    const donorData = JSON.parse(req.body.data || "{}");
    
    // Convert date strings to Date objects
    if (donorData.dateOfBirth) {
      donorData.dateOfBirth = new Date(donorData.dateOfBirth);
    }
    if (donorData.lastDonationDate) {
      donorData.lastDonationDate = new Date(donorData.lastDonationDate);
    }

    if (req.file) {
      // Delete old image if it exists
      if (donor.image) {
        const oldImagePath = path.join(__dirname, "..", donor.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      donorData.image = `/uploads/${req.file.filename}`;
    }

    const updatedDonor = await Donor.findByIdAndUpdate(
      req.params.id, 
      donorData, 
      { new: true }
    );

    const donorObj = updatedDonor.toObject();
    donorObj.image = updatedDonor.image ? `http://localhost:5000${updatedDonor.image}` : null;
    res.json(donorObj);
  } catch (error) {
    console.error("Error updating donor:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    // Delete associated image if it exists
    if (donor.image) {
      const imagePath = path.join(__dirname, "..", donor.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Donor.findByIdAndDelete(req.params.id);
    res.json({ message: "Donor deleted successfully" });
  } catch (error) {
    console.error("Error deleting donor:", error);
    res.status(500).json({ message: error.message });
  }
};
