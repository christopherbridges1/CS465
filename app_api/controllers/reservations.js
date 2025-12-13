const Reservation = require("../models/reservation");

const reservationsList = async (req, res) => {
  try {
    const rows = await Reservation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const reservationsCreate = async (req, res) => {
  try {
    const { tripCode, partySize } = req.body;
    if (!tripCode) return res.status(400).json({ message: "tripCode is required" });

    const created = await Reservation.create({
      user: req.user._id,
      tripCode,
      partySize: partySize ?? 1,
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { reservationsList, reservationsCreate };
