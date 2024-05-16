'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(options, [
        {
          spotId: 9,
          userId: 3,
          review: 'Great place, very clean and well maintained!',
          stars: 5
        },
        {
          spotId: 7,
          userId: 4,
          review: 'Nice location but a bit noisy.',
          stars: 3
        },
        {
          spotId: 2,
          userId: 1,
          review: 'Amazing experience, will definitely come back!',
          stars: 5
        },
        {
          spotId: 19,
          userId: 2,
          review: 'Decent place, but the service could be better.',
          stars: 4
        },
        {
          spotId: 17,
          userId: 5,
          review: 'Not as described, quite disappointing.',
          stars: 2
        },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.gt]: 0 }
    }, {});
  }
};
