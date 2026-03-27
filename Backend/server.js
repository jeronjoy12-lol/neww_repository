const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── CORS: Add your ACTUAL Render Frontend URL here ──────────────────────────
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        // 🔥 REPLACE the URL below with your actual live Render Frontend URL
        'https://neww-repository-1-frontend-live.onrender.com'
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// ── MongoDB connection ───────────────────────────────────────────────────────
const mongoURI = process.env.MONGO_URI;

// This check is great—it prevents the server from starting if the key is missing
if (!mongoURI) {
    console.error('❌ ERROR: MONGO_URI is missing. Check Render Env Vars!');
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ── Schema & Model ───────────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// ── Routes ───────────────────────────────────────────────────────────────────
app.post('/contact', async (req, res) => {
    console.log('📩 Incoming Data:', req.body);
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({ message: 'Message saved successfully!' });
    } catch (error) {
        console.error('❌ Server Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('🚀 Portfolio Backend is live and connected!');
});

// ── Start server ─────────────────────────────────────────────────────────────
// Render automatically provides a PORT, so process.env.PORT is mandatory
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));;