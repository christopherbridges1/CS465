var express = require('express');
var router = express.Router();

const ctrlMain = require('../controllers/main');
const ctrlAuth = require('../controllers/auth');
const ctrlReservations = require('../controllers/reservations.js');

function requireLogin(req, res, next) {
  if (!req.auth?._id) return res.redirect("/login");
  next();
}
function requireAdmin(req, res, next) {
  if (!req.auth?._id) return res.redirect('/login');
  if (req.auth.role !== 'admin') return res.status(403).send('Forbidden');
  next();
}
router.get('/', ctrlMain.index);
router.get('/admin', requireAdmin, (req, res) => {
  res.redirect('http://localhost:4200');
})

router.get('/login', ctrlAuth.showLogin);
router.post('/login', ctrlAuth.doLogin);
router.get('/signup', ctrlAuth.showSignup);
router.post('/signup', ctrlAuth.doSignup);
router.get('/logout', ctrlAuth.logout);

router.get('/reservations', requireLogin, ctrlReservations.reservations);
router.post('/reservations/:tripCode', requireLogin, ctrlReservations.createReservation);


module.exports = router;
