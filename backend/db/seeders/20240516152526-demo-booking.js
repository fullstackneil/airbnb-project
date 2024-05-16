'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 8,
        userId: 3,
        startDate: new Date('1984-06-01T14:00:00Z'),
        endDate: new Date('1984-06-07T10:00:00Z')
      },
      {
        spotId: 12,
        userId: 4,
        startDate: new Date('1994-07-10T15:00:00Z'),
        endDate: new Date('1994-07-15T11:00:00Z')
      },
      {
        spotId: 13,
        userId: 1,
        startDate: new Date('2004-08-05T13:00:00Z'),
        endDate: new Date('2004-08-12T09:00:00Z')
      },
      {
        spotId: 18,
        userId: 2,
        startDate: new Date('2014-09-01T16:00:00Z'),
        endDate: new Date('2014-09-10T12:00:00Z')
      },
      {
        spotId: 20,
        userId: 5,
        startDate: new Date('2024-10-15T14:00:00Z'),
        endDate: new Date('2024-10-20T10:00:00Z')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.gt]: 0 }
    }, {});
  }
};
