const mongoose = require("mongoose");

// Define the schema for storing contact form data
const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// Create the Contact model
const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact; // Export the model
