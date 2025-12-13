const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tripCode: { type: String, required: true },
    partySize: { type: Number, default: 1, min: 1 },
    status: { type: String, default: "booked" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
