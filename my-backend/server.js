require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// Route for the index page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Debugging: Check environment variables
console.log("🔹 MONGO_URL:", process.env.MONGO_URL ? "Loaded" : "Not Found");
console.log("🔹 JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Not Found");

if (!process.env.MONGO_URL || !process.env.JWT_SECRET) {
    console.error("❌ ERROR: Missing environment variables. Check .env file.");
    process.exit(1);
}

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Schemas & Models (Fix OverwriteModelError)
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});
const paymentSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    city: String,
    state: String,
    pinCode: String,
    paymentMethod: String,
    amount: Number,
    date: { type: Date, default: Date.now }
});
const contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    message: String,
    date: { type: Date, default: Date.now }
});

// Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

// ✅ API Routes

// 🔹 User Registration
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (await User.findOne({ email })) return res.status(400).json({ error: "❌ Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        res.json({ message: "✅ User Registered!" });
    } catch (err) {
        res.status(500).json({ error: "❌ Server error" });
    }
});

// 🔹 User Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "❌ User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "❌ Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, message: "✅ Login Successful!" });
    } catch (err) {
        res.status(500).json({ error: "❌ Server error" });
    }
});

// 🔹 Middleware: Verify Token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "❌ Access Denied" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "❌ Invalid Token" });
    }
};

// 🔹 User Profile (Protected)
app.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: "❌ Error fetching user profile" });
    }
});

// 🔹 Payment API
app.post("/api/payment", async (req, res) => {
    try {
        const newPayment = new Payment(req.body);
        await newPayment.save();
        res.status(201).json({ message: "✅ Payment recorded successfully!" });
    } catch (err) {
        res.status(500).json({ message: "❌ Error processing payment", error: err });
    }
});

// 🔹 Contact Form API
app.post("/api/contact", async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json({ message: "✅ Contact info saved successfully!" });
    } catch (err) {
        res.status(500).json({ message: "❌ Error saving contact info", error: err });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
