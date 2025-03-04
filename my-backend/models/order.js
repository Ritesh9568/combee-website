const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: String,
    email: String,
    contact: String,
    address: String,
    city: String,
    tshirt_quantity: Number,
    tshirt_size: String,
    tshirt_color: String,
    gift: String,
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
