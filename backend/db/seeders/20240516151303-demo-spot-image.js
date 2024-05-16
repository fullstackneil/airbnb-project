'use strict';

/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "SpotImages";
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://www.starlighthaven.com/cottage-123',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://www.tranquilretreats.com/forest-lodge',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://www.luxurygetaway.com/penthouse-suite',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://www.seasidesanctuary.com/beach-bungalow',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://www.mountainescape.com/cabin-retreat',
        preview: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.gt]: 0 }
    }, {});
  }
};
