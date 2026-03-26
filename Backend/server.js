const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();

// ✅ FIX 1: Updated CORS to allow your future Render Frontend URL
app.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500", "https://your-frontend.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

// ✅ FIX 2: Better Connection Logic
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error("❌ ERROR: MONGODB_URI is missing in .env file!");
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// SCHEMA
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

// ✅ FIX 3: Route matches your Frontend fetch exactly
app.post("/contact", async (req, res) => {
    console.log("📩 Incoming Data:", req.body);
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields required" });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({ message: "Message saved successfully!" });

    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("Backend is live!");
});

// ✅ FIX 4: Use process.env.PORT for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});