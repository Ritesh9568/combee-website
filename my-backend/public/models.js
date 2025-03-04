const mongoose = require('./database');

// User Schema (Signup & Login)
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', userSchema);

// Purchase Schema
const purchaseSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    productName: String,
    price: Number,
    date: { type: Date, default: Date.now }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = { User, Purchase };
