const express = require('express');

const { User, Spot } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

// GET ALL SPOTS
router.get('/', async (req, res) => {
    let allSpots = await Spot.findAll();
    res.status(200);
    return res.json({ "Spots": allSpots });
});


module.exports = router;
