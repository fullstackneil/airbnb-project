'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Fake',
        lastName: 'Dog',
        email: 'user1@user.io',
        username: 'FakeDog1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Tricky',
        lastName: 'Cat',
        email: 'user2@user.io',
        username: 'FakeCat2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Slow',
        lastName: 'Turtle',
        email: 'user3@user.io',
        username: 'FakeTurtle3',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Fast',
        lastName: 'Cheetah',
        email: 'user4@user.io',
        username: 'FakeCheetah4',
        hashedPassword: bcrypt.hashSync('password5')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeDog1', 'FakeCat2', 'FakeTurtle3', 'FakeCheetah4'] }
    }, {});
  }
};
