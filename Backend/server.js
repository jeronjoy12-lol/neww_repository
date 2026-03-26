const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config(); // Load variables from .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 CONNECT TO MONGODB
// Use the URI from your .env file instead of the local 127.0.0.1
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolioDB";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 🔥 CREATE SCHEMA
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model("Contact", contactSchema);

// 🔥 ROUTE (Changed to /contact to match your frontend error)
app.post("/contact", async (req, res) => {
    console.log("Incoming Data:", req.body);
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields required" });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({ message: "Saved successfully" });

    } catch (error) {
        console.error("Worker Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("Backend running and connected to MongoDB");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});