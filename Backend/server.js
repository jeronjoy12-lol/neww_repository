const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

// ── CORS: allow all local dev origins + production ──────────────────────────
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:3000',
        'http://localhost:5173',
        'https://your-frontend.onrender.com'
    ],
    methods:     ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// ── MongoDB connection ───────────────────────────────────────────────────────
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error('❌ ERROR: MONGODB_URI is missing in .env');
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

// ── Schema & Model ───────────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    email:     { type: String, required: true },
    message:   { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// ── Routes ───────────────────────────────────────────────────────────────────

// POST /contact  — matches frontend fetch('http://localhost:5000/contact')
app.post('/contact', async (req, res) => {
    console.log('📩 Incoming:', req.body);
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

// GET / — health check
app.get('/', (req, res) => {
    res.send('🚀 Portfolio Backend is live!');
});

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));