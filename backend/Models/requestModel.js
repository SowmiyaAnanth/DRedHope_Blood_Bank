const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  requesterName: {
    type: String,
    required: true,
  },
  requesterType: {
    type: String,
    enum: ["Patient", "Hospital"],
    required: true,
  },
  patientOrHospitalId: {
    type: String,
    required: function () {
      return this.requesterType === "Hospital";
    },
  },
  bloodGroup: {
    type: [String],
    enum: ["A+", "A-", "B+", "B-", "AB+", "O+", "O-"],
    required: true,
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  emergencyLevel: {
    type: String,
    enum: ["Normal", "Emergency"],
    required: true,
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BloodRequest", requestSchema);
