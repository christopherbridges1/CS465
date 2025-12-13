const Reservation = require('../../app_api/models/reservation');
const Trip = require('../../app_api/models/travlr');

// GET /reservations
const reservations = async (req, res) => {
  try {
    const userId = req.auth._id;

    // Get reservations for this user
    const reservations = await Reservation
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    const tripCodes = reservations.map(r => r.tripCode);
    const trips = await Trip.find({ code: { $in: tripCodes } }).lean();
    const tripMap = new Map(trips.map(t => [t.code, t]));

    const viewModel = reservations.map(r => ({
      ...r,
      trip: tripMap.get(r.tripCode) || { code: r.tripCode, name: '(Trip not found)' }
    }));

    res.render('reservations', {
      title: 'Travlr Getaways',
      reservations: viewModel
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load reservations');
  }
};

const createReservation = async (req, res) => {
  try {
    const tripCode = req.params.tripCode;
    const userId = req.auth._id;

    // Verify trip exists
    const trip = await Trip.findOne({ code: tripCode }).lean();
    if (!trip) return res.status(404).send('Trip not found');

    // Prevent duplicates
    const exists = await Reservation.findOne({ user: userId, tripCode }).lean();
    if (exists) return res.redirect('/reservations');

    // Create reservation 
    await Reservation.create({
      user: userId,
      tripCode,
      partySize: 1,
      status: 'booked'
    });

    return res.redirect('/reservations');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Failed to create reservation');
  }
};

module.exports = { reservations, createReservation };
