const express = require("express");
const router = express.Router();
const Payment = require("../models/payment");

router.post("/api/payment", async (req, res) => {
    try {
        const newPayment = new Payment(req.body);
        await newPayment.save();
        res.status(201).json({ message: "Payment saved successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving payment", error });
    }
});

module.exports = router;
