const express = require("express");
const Trade = require("../models/Trade"); // Assuming Trade model exists
const router = express.Router();

// ✅ Add Trade
router.post("/add", async (req, res) => {
    try {
        const { userId, pair, type, chartLink, withinContext, FormedPD, notes, bias, divergence, opposingPD, tradable } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const newTrade = new Trade({
            userId,
            pair,
            type,
            chartLink,
            withinContext,
            FormedPD,
            notes,
            bias,
            divergence,
            opposingPD,
            tradable
        });

        await newTrade.save();
        res.status(201).json({ message: "Trade added successfully", trade: newTrade });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Get All Trades
router.get("/all/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const trades = await Trade.find({ user: userId });

        res.json(trades);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// ✅ Get Trade by ID
router.get("/:id", async (req, res) => {
    try {
        const trade = await Trade.findById(req.params.id);
        if (!trade) {
            return res.status(404).json({ message: "Trade not found" });
        }
        res.json(trade);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Get Trades by Type
router.get("/type/:type", async (req, res) => {
    try {
        const trades = await Trade.find({ type: req.params.type });
        res.json(trades);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Update Trade by ID
router.put("/update/:id", async (req, res) => {
    try {
        const updatedTrade = await Trade.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTrade) {
            return res.status(404).json({ message: "Trade not found" });
        }
        res.json({ message: "Trade updated successfully", trade: updatedTrade });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Delete Trade by ID
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedTrade = await Trade.findByIdAndDelete(req.params.id);
        if (!deletedTrade) {
            return res.status(404).json({ message: "Trade not found" });
        }
        res.json({ message: "Trade deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;


