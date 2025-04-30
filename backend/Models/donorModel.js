const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  bloodGroup: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  weight: { type: Number},
  height: { type: Number},
  chronicDiseases: { type: String, default: "" },
  recentSurgery: { type: Boolean, default: false },
  onMedication: { type: Boolean, default: false },
  lastDonationDate: { type: Date },
  hadPreviousDonation: { type: Boolean, default: false },
  image: { type: String }
});

module.exports = mongoose.model('Donor', donorSchema);
