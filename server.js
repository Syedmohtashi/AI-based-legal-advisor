const { ObjectId } = require("mongodb");
const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db"); // Database connection

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); // Import User model

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
async function main() {
  const db = await connectDB();
  const usersCollection = db.collection("users");

  // 🚀 ✅ Register Route
  app.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check if user exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ error: "User already exists" });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save user
      user = new User({ name, email, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  });

  // 🚀 ✅ Login Route
  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  });

  // 🚀 ✅ Get All Users
  app.get("/users", async (req, res) => {
    try {
      const users = await usersCollection.find().toArray();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Fetch failed", details: error.message });
    }
  });

  // 🚀 ✅ Update User by ID
  app.put("/updateUser/:id", async (req, res) => {
    let id = req.params.id.trim(); // Trim spaces
    const updatedData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "Update successful", result });
    } catch (error) {
      res.status(500).json({ error: "Update failed", details: error.message });
    }
  });

  // 🚀 ✅ Delete User by ID
  app.delete("/deleteUser/:id", async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
      res.json({ message: "User deleted successfully", result });
    } catch (error) {
      res.status(500).json({ error: "Delete failed", details: error.message });
    }
  });

  // Start Server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

main().catch(console.error);
