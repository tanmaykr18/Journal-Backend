const mongoose = require("mongoose");

const TradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pair: { type: String, required: true },
  type: { type: String, required: true },
  chartLink: { type: String, required: true },
  withinContext: {
    m: { type: Boolean, default: false },
    w: { type: Boolean, default: false },
    d: { type: Boolean, default: false },
  },
  FormedPD: {
    w: { type: Boolean, default: false },
    d: { type: Boolean, default: false },
    "4h": { type: Boolean, default: false },
    "1h": { type: Boolean, default: false },
  },
  notes: { type: String, default: "" },
  bias: { type: String, default: "" },
  divergence: { type: Boolean, default: false },
  opposingPD: { type: Boolean, default: false },
  tradable: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Trade", TradeSchema);

