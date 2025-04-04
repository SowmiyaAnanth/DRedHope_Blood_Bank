const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Import all route files
// const donorRoutes = require("./Routes/donorRoutes");
const bloodInventoryRoutes = require("./Routes/bloodInventoryRoutes");
// const eventRoutes = require("./Routes/eventRoutes");
const requestRoutes = require("./Routes/requestRoutes");

// Initialize config and app
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
// app.use("/api/donors", donorRoutes);
app.use("/api/blood-inventory", bloodInventoryRoutes);
// app.use("/api/events", eventRoutes);
app.use("/api/blood-requests", requestRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
