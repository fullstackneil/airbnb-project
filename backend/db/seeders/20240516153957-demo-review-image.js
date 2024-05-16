'use strict';

/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://travelreviews.com/images/sunset-villa-5.jpg'
      },
      {
        reviewId: 2,
        url: 'https://vacaypics.net/reviews/beachside-escape-10.png'
      },
      {
        reviewId: 3,
        url: 'https://holidaymoments.org/photos/mountain-cabin-3.jpg'
      },
      {
        reviewId: 4,
        url: 'https://exploreandstay.com/media/luxury-suite-8.jpg'
      },
      {
        reviewId: 5,
        url: 'https://adventurestays.com/gallery/forest-lodge-2.jpg'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.gt]: 0 }
    }, {});
  }
};
