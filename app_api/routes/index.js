const express = require("express");
const router = express.Router();

const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");
const reservationsController = require("../controllers/reservations");
const jwt = require("jsonwebtoken");

// Authenticate JWT
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    return res.sendStatus(401);
  }
}

// Admin-only guard
function requireAdmin(req, res, next) {
  if (req.auth?.role !== "admin") return res.sendStatus(403);
  return next();
}

// Auth
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

// Trips collection
router
  .route("/trips")
  .get(tripsController.tripsList)
  .post(authenticateJWT, requireAdmin, tripsController.tripsAddTrip);

// Single trip by code
router
  .route("/trips/:tripCode")
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, requireAdmin, tripsController.tripsUpdateTrip)
  .delete(authenticateJWT, requireAdmin, tripsController.tripsDeleteTrip);

router
  .route("/reservations")
  .get(authenticateJWT, reservationsController.reservationsList)
  .post(authenticateJWT, reservationsController.reservationsCreate);

module.exports = router;
