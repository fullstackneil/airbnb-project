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
        firstName: "Luke",
        lastName: "Skywalker",
        email: "luke.skywalker@rebellion.co",
        username: "jediMasterLuke",
        hashedPassword: bcrypt.hashSync("yoda1234")
      },
      {
        firstName: "Leia",
        lastName: "Organa",
        email: "leia.organa@alderaan.org",
        username: "princessLeia",
        hashedPassword: bcrypt.hashSync("alderaan456")
      },
      {
        firstName: "Han",
        lastName: "Solo",
        email: "han.solo@millenniumfalcon.net",
        username: "captainSolo",
        hashedPassword: bcrypt.hashSync("falcon789")
      },
      {
        firstName: "Chewbacca",
        lastName: "Wookiee",
        email: "chewbacca@kashyyyk.space",
        username: "chewie",
        hashedPassword: bcrypt.hashSync("rrrawwr")
      },
      {
        firstName: "Anakin",
        lastName: "Skywalker",
        email: "anakin.skywalker@empire.org",
        username: "darthVader",
        hashedPassword: bcrypt.hashSync("darkside")
      },
      {
        firstName: "Obi-Wan",
        lastName: "Kenobi",
        email: "obiwan.kenobi@jediorder.com",
        username: "benKenobi",
        hashedPassword: bcrypt.hashSync("helloThere")
      },
      {
        firstName: "Yoda",
        lastName: "Master",
        email: "yoda@dagobah.system",
        username: "masterYoda",
        hashedPassword: bcrypt.hashSync("forceStrong")
      },
      {
        firstName: "Padmé",
        lastName: "Amidala",
        email: "padme.amidala@naboosenate.gov",
        username: "queenPadme",
        hashedPassword: bcrypt.hashSync("naboo123")
      },
      {
        firstName: "Mace",
        lastName: "Windu",
        email: "mace.windu@jediorder.com",
        username: "masterWindu",
        hashedPassword: bcrypt.hashSync("purpleSaber")
      },
      {
        firstName: "Qui-Gon",
        lastName: "Jinn",
        email: "quigon.jinn@jediorder.com",
        username: "quiGon",
        hashedPassword: bcrypt.hashSync("livingForce")
      },
      {
        firstName: "Ahsoka",
        lastName: "Tano",
        email: "ahsoka.tano@fulcrum.org",
        username: "ahsoka",
        hashedPassword: bcrypt.hashSync("togruta")
      },
      {
        firstName: "Lando",
        lastName: "Calrissian",
        email: "lando.calrissian@cloudcity.biz",
        username: "lando",
        hashedPassword: bcrypt.hashSync("smoothTalker")
      },
      {
        firstName: "Rey",
        lastName: "Skywalker",
        email: "rey.skywalker@jakku.com",
        username: "scavengerRey",
        hashedPassword: bcrypt.hashSync("lightSaber")
      },
      {
        firstName: "Kylo",
        lastName: "Ren",
        email: "kylo.ren@firstorder.gov",
        username: "benSolo",
        hashedPassword: bcrypt.hashSync("knightOfRen")
      },
      {
        firstName: "Finn",
        lastName: "FN-2187",
        email: "finn@firstorder.gov",
        username: "finn",
        hashedPassword: bcrypt.hashSync("stormtrooper")
      },
      {
        firstName: "Poe",
        lastName: "Dameron",
        email: "poe.dameron@resistance.com",
        username: "blackLeader",
        hashedPassword: bcrypt.hashSync("xwingPilot")
      },
      {
        firstName: "Rose",
        lastName: "Tico",
        email: "rose.tico@resistance.com",
        username: "rose",
        hashedPassword: bcrypt.hashSync("engineer")
      },
      {
        firstName: "Jyn",
        lastName: "Erso",
        email: "jyn.erso@rebellion.co",
        username: "stardust",
        hashedPassword: bcrypt.hashSync("rogueOne")
      },
      {
        firstName: "Cassian",
        lastName: "Andor",
        email: "cassian.andor@rebellion.co",
        username: "captainAndor",
        hashedPassword: bcrypt.hashSync("spyMaster")
      },
      {
        firstName: "Galen",
        lastName: "Erso",
        email: "galen.erso@imperialscientist.org",
        username: "deathStarBuilder",
        hashedPassword: bcrypt.hashSync("kyberCrystals")
      },
      {
        firstName: "Saw",
        lastName: "Gerrera",
        email: "saw.gerrera@partisans.org",
        username: "saw",
        hashedPassword: bcrypt.hashSync("extremist")
      },
      {
        firstName: "Boba",
        lastName: "Fett",
        email: "boba.fett@bountyhunter.net",
        username: "bobaFett",
        hashedPassword: bcrypt.hashSync("mandalorian")
      },
      {
        firstName: "Jango",
        lastName: "Fett",
        email: "jango.fett@bountyhunter.net",
        username: "jangoFett",
        hashedPassword: bcrypt.hashSync("cloneDaddy")
      },
      {
        firstName: "Din",
        lastName: "Djarin",
        email: "din.djarin@mandalore.com",
        username: "mando",
        hashedPassword: bcrypt.hashSync("thisIsTheWay")
      },
      {
        firstName: "Grogu",
        lastName: "Unknown",
        email: "grogu@mandalore.com",
        username: "babyYoda",
        hashedPassword: bcrypt.hashSync("forceUser")
      },
      {
        firstName: "Kanan",
        lastName: "Jarrus",
        email: "kanan.jarrus@rebellion.co",
        username: "calebDume",
        hashedPassword: bcrypt.hashSync("blindJedi")
      },
      {
        firstName: "Ezra",
        lastName: "Bridger",
        email: "ezra.bridger@rebellion.co",
        username: "ezra",
        hashedPassword: bcrypt.hashSync("forceSensitive")
      },
      {
        firstName: "Hera",
        lastName: "Syndulla",
        email: "hera.syndulla@rebellion.co",
        username: "hera",
        hashedPassword: bcrypt.hashSync("pilot")
      },
      {
        firstName: "Chopper",
        lastName: "Droid",
        email: "chopper@rebellion.co",
        username: "chopper",
        hashedPassword: bcrypt.hashSync("astromech")
      },
      {
        firstName: "Sabine",
        lastName: "Wren",
        email: "sabine.wren@rebellion.co",
        username: "sabine",
        hashedPassword: bcrypt.hashSync("artist")
      },
      {
        firstName: "Bo-Katan",
        lastName: "Kryze",
        email: "bo.katan@mandalore.com",
        username: "boKatan",
        hashedPassword: bcrypt.hashSync("darkSaber")
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
