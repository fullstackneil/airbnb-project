'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
        lat: 39.781,
        lng: -89.650,
        name: 'Simpsons Home',
        description: 'The iconic home of Homer, Marge, Bart, Lisa, and Maggie Simpson.',
        price: 120.00
      },
      {
        ownerId: 2,
        address: '430 Spalding Way',
        city: 'Shelbyville',
        state: 'IL',
        country: 'USA',
        lat: 39.495,
        lng: -88.372,
        name: 'Flanders House',
        description: 'Home of the pious Ned Flanders and his family.',
        price: 95.00
      },
      {
        ownerId: 3,
        address: '123 Fake Street',
        city: 'Capital City',
        state: 'IL',
        country: 'USA',
        lat: 39.829,
        lng: -89.650,
        name: 'Burns Manor',
        description: 'The luxurious estate of the wealthy Mr. Burns.',
        price: 500.00
      },
      {
        ownerId: 4,
        address: '1 Ocean View Drive',
        city: 'Ogdenville',
        state: 'IL',
        country: 'USA',
        lat: 39.437,
        lng: -89.504,
        name: 'Moes Tavern',
        description: 'Popular bar owned by Moe Szyslak.',
        price: 80.00
      },
      {
        ownerId: 5,
        address: '1111 1st Avenue',
        city: 'Oklahoma City',
        state: 'OK',
        country: 'USA',
        lat: 39.926,
        lng: -83.819,
        name: 'Kwik-E-Mart',
        description: 'Convenience store owned by Apu Nahasapeemapetilon.',
        price: 65.00
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
