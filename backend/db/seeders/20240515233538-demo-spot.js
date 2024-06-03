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
      {
        ownerId: 6,
        address: '1007 Mountain Drive',
        city: 'Gotham',
        state: 'NY',
        country: 'USA',
        lat: 40.7128,
        lng: -74.0060,
        name: 'Wayne Manor',
        description: 'The stately manor of Bruce Wayne, aka Batman.',
        price: 800.00
      },
      {
        ownerId: 7,
        address: '500 Elm Street',
        city: 'Springwood',
        state: 'OH',
        country: 'USA',
        lat: 39.7589,
        lng: -84.1916,
        name: 'Elm Street House',
        description: 'Infamous house from the Nightmare on Elm Street.',
        price: 70.00
      },
      {
        ownerId: 8,
        address: '123 Mockingbird Lane',
        city: 'Mockingbird Heights',
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Munster House',
        description: 'The spooky home of the Munster family.',
        price: 85.00
      },
      {
        ownerId: 9,
        address: '21 Jump Street',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: '21 Jump Street HQ',
        description: 'Former undercover police station turned rental.',
        price: 120.00
      },
      {
        ownerId: 10,
        address: '1164 Morning Glory Circle',
        city: 'Westport',
        state: 'CT',
        country: 'USA',
        lat: 41.1415,
        lng: -73.3579,
        name: 'Bewitched House',
        description: 'The magical home of Samantha Stephens.',
        price: 110.00
      },
      {
        ownerId: 11,
        address: '4 Privet Drive',
        city: 'Little Whinging',
        state: 'Surrey',
        country: 'UK',
        lat: 51.556,
        lng: -0.1657,
        name: 'Dursley Residence',
        description: 'The house where Harry Potter grew up.',
        price: 75.00
      },
      {
        ownerId: 12,
        address: '124 Conch Street',
        city: 'Bikini Bottom',
        state: 'Pacific Ocean',
        country: 'USA',
        lat: 32.7157,
        lng: -117.1611,
        name: 'SpongeBobs Pineapple',
        description: 'Underwater home of SpongeBob SquarePants.',
        price: 55.00
      },
      {
        ownerId: 13,
        address: '42 Wallaby Way',
        city: 'Sydney',
        state: 'NSW',
        country: 'Australia',
        lat: -33.8688,
        lng: 151.2093,
        name: 'P. Shermans Office',
        description: 'The dental office from Finding Nemo.',
        price: 90.00
      },
      {
        ownerId: 14,
        address: '1600 Pennsylvania Avenue NW',
        city: 'Washington',
        state: 'DC',
        country: 'USA',
        lat: 38.8977,
        lng: -77.0365,
        name: 'White House',
        description: 'Historic home of the U.S. president.',
        price: 1000.00
      },
      {
        ownerId: 15,
        address: '1313 Cemetery Lane',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        lat: 40.7128,
        lng: -74.0060,
        name: 'Addams Family Mansion',
        description: 'The eerie home of the Addams Family.',
        price: 125.00
      },
      {
        ownerId: 16,
        address: '123 Hill Valley',
        city: 'Hill Valley',
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Marty McFlys House',
        description: 'Home of Marty McFly from Back to the Future.',
        price: 95.00
      },
      {
        ownerId: 17,
        address: '12 Grimmauld Place',
        city: 'London',
        state: 'England',
        country: 'UK',
        lat: 51.5074,
        lng: -0.1278,
        name: 'Sirius Blacks House',
        description: 'Secret headquarters of the Order of the Phoenix.',
        price: 130.00
      },
      {
        ownerId: 18,
        address: '5 Jabba Drive',
        city: 'Tatooine',
        state: 'Outer Rim',
        country: 'Galaxy',
        lat: 27.1751,
        lng: 78.0421,
        name: 'Jabbas Palace',
        description: 'The palace of Jabba the Hutt.',
        price: 150.00
      },
      {
        ownerId: 19,
        address: '1313 Webfoot Walk',
        city: 'Duckburg',
        state: 'Calisota',
        country: 'USA',
        lat: 36.7783,
        lng: -119.4179,
        name: 'Scrooge McDucks Mansion',
        description: 'Home of the richest duck in the world.',
        price: 200.00
      },
      {
        ownerId: 20,
        address: '42 Cherry Tree Lane',
        city: 'London',
        state: 'England',
        country: 'UK',
        lat: 51.5074,
        lng: -0.1278,
        name: 'Banks Residence',
        description: 'Home from Mary Poppins.',
        price: 105.00
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
