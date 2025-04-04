const BloodRequest = require("../Models/requestModel");

// Create Request
exports.createRequest = async (req, res) => {
  try {
    const newRequest = new BloodRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: "Blood request created", newRequest });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Request By ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Request
exports.updateRequest = async (req, res) => {
  try {
    const updatedRequest = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Request updated", updatedRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Request
exports.deleteRequest = async (req, res) => {
  try {
    const deletedRequest = await BloodRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Request deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
