const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const spotImagesRouter = require('./spotimages.js');
const reviewsRouter = require('./reviews.js');
const reviewImagesRouter = require('./reviewimages.js');
const bookingsRouter = require('./bookings.js');
const { restoreUser } = require('../../utils/auth.js');


// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/spot-images', spotImagesRouter);

router.use('/reviews', reviewsRouter);

router.use('/review-images', reviewImagesRouter);

router.use('/bookings', bookingsRouter);

// TEMPORARY: reports how the app sees the caller's IP so the proxy hop count
// (TRUST_PROXY_HOPS) can be measured on Render. Remove once configured.
router.get('/ip', (req, res) => {
  const forwarded = (req.headers['x-forwarded-for'] || '').split(',').map((s) => s.trim()).filter(Boolean);
  res.json({ ip: req.ip, trustProxyHops: req.app.get('trust proxy'), forwardedFor: forwarded });
});

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});


module.exports = router;
