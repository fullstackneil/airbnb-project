// Request-body validation for spots and reviews. Messages follow the API
// spec in the project README.
const { body } = require('express-validator');
const { handleValidationErrors } = require('./validation');

const requiredText = (field, message) =>
  body(field)
    .exists({ checkNull: true }).withMessage(message).bail()
    .isString().withMessage(message).bail()
    .trim()
    .notEmpty().withMessage(message);

// Latitude/longitude are optional; when present they must be in range.
const optionalCoordinate = (field, min, max, message) =>
  body(field)
    .optional({ values: 'null' })
    .isFloat({ min, max })
    .withMessage(message);

const validateSpot = [
  requiredText('address', 'Street address is required'),
  requiredText('city', 'City is required'),
  requiredText('state', 'State is required'),
  requiredText('country', 'Country is required'),
  optionalCoordinate('lat', -90, 90, 'Latitude must be within -90 and 90'),
  optionalCoordinate('lng', -180, 180, 'Longitude must be within -180 and 180'),
  requiredText('name', 'Name is required')
    .isLength({ max: 49 })
    .withMessage('Name must be less than 50 characters'),
  requiredText('description', 'Description is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price per day must be a positive number'),
  handleValidationErrors,
];

// Photo links must be http(s) URLs to a common image type (query strings are
// allowed, e.g. CDN resize parameters).
const IMAGE_URL = /^https?:\/\/[^\s]+\.(png|jpe?g|gif|webp|avif)(\?[^\s]*)?$/i;

const validateSpotImage = [
  body('url')
    .exists({ checkNull: true }).withMessage('Image URL is required').bail()
    .isString().withMessage('Image URL is required').bail()
    .trim()
    .matches(IMAGE_URL)
    .withMessage('Image URL must start with http(s):// and end in .png, .jpg, .jpeg, .gif, .webp or .avif'),
  body('preview').isBoolean({ strict: true }).withMessage('Preview must be true or false'),
  handleValidationErrors,
];

const validateReview = [
  requiredText('review', 'Review text is required'),
  body('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors,
];

module.exports = { validateSpot, validateSpotImage, validateReview, IMAGE_URL };
