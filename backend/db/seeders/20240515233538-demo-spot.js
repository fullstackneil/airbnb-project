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
        address: 'Mos Eisley Spaceport',
        city: 'Mos Eisley',
        state: 'Tatooine',
        country: 'Outer Rim',
        lat: 35.011,
        lng: -111.663,
        name: 'Mos Eisley Cantina',
        description: 'A wretched hive of scum and villainy. Perfect for the adventurous traveler.',
        price: 200.00
      },
      {
        ownerId: 2,
        address: 'Echo Base',
        city: 'Hoth',
        state: 'Outer Rim',
        country: 'Outer Rim Territories',
        lat: 63.333,
        lng: -64.750,
        name: 'Hoth Rebel Base',
        description: 'Stay at the iconic Rebel base on the icy planet of Hoth.',
        price: 150.00
      },
      {
        ownerId: 3,
        address: '500 Republica',
        city: 'Galactic City',
        state: 'Coruscant',
        country: 'Core Worlds',
        lat: 0.000,
        lng: 0.000,
        name: 'Coruscant Luxury Apartment',
        description: 'A luxurious apartment in the heart of Galactic City on Coruscant.',
        price: 500.00
      },
      {
        ownerId: 4,
        address: 'Dagobah Swamp',
        city: 'Dagobah',
        state: 'Sluis Sector',
        country: 'Outer Rim Territories',
        lat: 32.083,
        lng: -64.733,
        name: 'Yoda’s Hut',
        description: 'A secluded hut in the swamps of Dagobah, perfect for meditation and solitude.',
        price: 80.00
      },
      {
        ownerId: 5,
        address: '123 Ewok Village',
        city: 'Bright Tree Village',
        state: 'Endor',
        country: 'Outer Rim',
        lat: 0.000,
        lng: 0.000,
        name: 'Ewok Treehouse',
        description: 'A charming treehouse in the Ewok village on the forest moon of Endor.',
        price: 100.00
      },
      {
        ownerId: 6,
        address: 'Cloud City',
        city: 'Bespin',
        state: 'Bespin',
        country: 'Outer Rim',
        lat: 27.125,
        lng: -82.469,
        name: 'Cloud City Suite',
        description: 'A luxurious suite in the floating city of Bespin.',
        price: 400.00
      },
      {
        ownerId: 7,
        address: 'Theed Palace',
        city: 'Theed',
        state: 'Naboo',
        country: 'Mid Rim',
        lat: 35.201,
        lng: -111.661,
        name: 'Naboo Palace Room',
        description: 'Stay in the beautiful royal palace of Theed on Naboo.',
        price: 350.00
      },
      {
        ownerId: 8,
        address: 'Jedi Temple',
        city: 'Galactic City',
        state: 'Coruscant',
        country: 'Core Worlds',
        lat: 0.000,
        lng: 0.000,
        name: 'Jedi Temple Dormitory',
        description: 'Experience the life of a Jedi in the dormitories of the Jedi Temple.',
        price: 120.00
      },
      {
        ownerId: 9,
        address: 'Kamino Cloning Facility',
        city: 'Tipoca City',
        state: 'Kamino',
        country: 'Outer Rim Territories',
        lat: -1.000,
        lng: 150.000,
        name: 'Kamino Ocean View',
        description: 'A modern room with stunning ocean views in Tipoca City on Kamino.',
        price: 220.00
      },
      {
        ownerId: 10,
        address: 'Jabba’s Palace',
        city: 'Tatooine',
        state: 'Outer Rim',
        country: 'Outer Rim Territories',
        lat: 35.000,
        lng: -111.000,
        name: 'Jabba’s Guest Room',
        description: 'A guest room in the palace of the infamous Jabba the Hutt.',
        price: 180.00
      },
      {
        ownerId: 11,
        address: 'Mustafar Castle',
        city: 'Mustafar',
        state: 'Outer Rim',
        country: 'Outer Rim Territories',
        lat: 1.000,
        lng: 122.000,
        name: 'Vader’s Castle',
        description: 'A room in the foreboding castle of Darth Vader on Mustafar.',
        price: 300.00
      },
      {
        ownerId: 12,
        address: 'Takodana Castle',
        city: 'Takodana',
        state: 'Mid Rim',
        country: 'Mid Rim Territories',
        lat: 34.000,
        lng: -84.000,
        name: 'Maz’s Castle',
        description: 'Stay in the historic castle of Maz Kanata on Takodana.',
        price: 250.00
      },
      {
        ownerId: 13,
        address: 'Lothal Tower',
        city: 'Lothal',
        state: 'Outer Rim',
        country: 'Outer Rim Territories',
        lat: 38.000,
        lng: -122.000,
        name: 'Lothal Tower Apartment',
        description: 'A modern apartment in the capital city of Lothal.',
        price: 130.00
      },
      {
        ownerId: 14,
        address: 'Scarif Beach House',
        city: 'Scarif',
        state: 'Outer Rim',
        country: 'Outer Rim Territories',
        lat: 21.000,
        lng: 105.000,
        name: 'Scarif Beach Retreat',
        description: 'A serene beach house on the tropical planet of Scarif.',
        price: 270.00
      },
      {
        ownerId: 15,
        address: 'Mon Cala Palace',
        city: 'Mon Cala',
        state: 'Mid Rim',
        country: 'Mid Rim Territories',
        lat: 14.000,
        lng: -72.000,
        name: 'Mon Cala Underwater Suite',
        description: 'An underwater suite in the palace of Mon Cala.',
        price: 380.00
      },
      {
        ownerId: 16,
        address: 'Geonosis Hive',
        city: 'Geonosis',
        state: 'Outer Rim',
        country: 'Outer Rim Territories',
        lat: -15.000,
        lng: 23.000,
        name: 'Geonosis Hive Room',
        description: 'A unique room in the hives of Geonosis.',
        price: 140.00
      },
      {
        ownerId: 17,
        address: 'Jedha City',
        city: 'Jedha',
        state: 'Mid Rim',
        country: 'Mid Rim Territories',
        lat: 31.000,
        lng: 35.000,
        name: 'Jedha Pilgrim’s Lodge',
        description: 'A cozy lodge for pilgrims in the holy city of Jedha.',
        price: 110.00
      },
      {
        ownerId: 18,
        address: 'D’Qar Base',
        city: 'D’Qar',
        state: 'Outer Rim',
        country: 'Outer Rim Territories',
        lat: 40.000,
        lng: -120.000,
        name: 'Resistance Base Room',
        description: 'Stay at the Resistance base on the planet D’Qar.',
        price: 160.00
      },
      {
        ownerId: 19,
        address: 'Canto Bight Hotel',
        city: 'Canto Bight',
        state: 'Cantonica',
        country: 'Outer Rim Territories',
        lat: 28.000,
        lng: -81.000,
        name: 'Canto Bight Luxury Suite',
        description: 'A lavish suite in the casino city of Canto Bight.',
        price: 450.00
      },
      {
        ownerId: 20,
        address: 'Rishi Outpost',
        city: 'Rishi',
        state: 'Outer Rim',
        country: 'Outer Rim Territories',
        lat: 10.000,
        lng: 110.000,
        name: 'Rishi Jungle Bungalow',
        description: 'A secluded bungalow in the jungle of Rishi.',
        price: 190.00
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.gt]: 0 }
    }, {});
  }
};
