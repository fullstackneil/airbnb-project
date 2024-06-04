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
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528638/Gemini_Generated_Image_86qlsz86qlsz86ql_1_usit3k.jpg",
        preview: true,
      },
      {
        spotId: 1,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528638/Gemini_Generated_Image_86qlsz86qlsz86ql_1_usit3k.jpg",
        preview: false,
      },
      {
        spotId: 1,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528638/Gemini_Generated_Image_86qlsz86qlsz86ql_1_usit3k.jpg",
        preview: false,
      },
      {
        spotId: 1,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528638/Gemini_Generated_Image_86qlsz86qlsz86ql_1_usit3k.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528636/Gemini_Generated_Image_9jv8ye9jv8ye9jv8_i7otur.jpg",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528636/Gemini_Generated_Image_9jv8ye9jv8ye9jv8_i7otur.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528636/Gemini_Generated_Image_9jv8ye9jv8ye9jv8_i7otur.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528636/Gemini_Generated_Image_9jv8ye9jv8ye9jv8_i7otur.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528642/Gemini_Generated_Image_njtihlnjtihlnjti_3_o16fb9.jpg",
        preview: true,
      },
      {
        spotId: 3,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528642/Gemini_Generated_Image_njtihlnjtihlnjti_3_o16fb9.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528642/Gemini_Generated_Image_njtihlnjtihlnjti_3_o16fb9.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528642/Gemini_Generated_Image_njtihlnjtihlnjti_3_o16fb9.jpg",
        preview: false,
      },
      {
        spotId: 4,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528647/Gemini_Generated_Image_t39fx1t39fx1t39f_qakmns.jpg",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528647/Gemini_Generated_Image_t39fx1t39fx1t39f_qakmns.jpg",
        preview: false,
      },
      {
        spotId: 4,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528647/Gemini_Generated_Image_t39fx1t39fx1t39f_qakmns.jpg",
        preview: false,
      },
      {
        spotId: 4,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528647/Gemini_Generated_Image_t39fx1t39fx1t39f_qakmns.jpg",
        preview: false,
      },
      {
        spotId: 5,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528646/Gemini_Generated_Image_t39fx0t39fx0t39f_ymqygt.jpg",
        preview: true,
      },
      {
        spotId: 5,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528646/Gemini_Generated_Image_t39fx0t39fx0t39f_ymqygt.jpg",
        preview: false,
      },
      {
        spotId: 5,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528646/Gemini_Generated_Image_t39fx0t39fx0t39f_ymqygt.jpg",
        preview: false,
      },
      {
        spotId: 5,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528646/Gemini_Generated_Image_t39fx0t39fx0t39f_ymqygt.jpg",
        preview: false,
      },
      {
        spotId: 6,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528643/Gemini_Generated_Image_njtihmnjtihmnjti_1_wqn1qk.jpg",
        preview: true,
      },
      {
        spotId: 6,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528643/Gemini_Generated_Image_njtihmnjtihmnjti_1_wqn1qk.jpg",
        preview: false,
      },
      {
        spotId: 6,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528643/Gemini_Generated_Image_njtihmnjtihmnjti_1_wqn1qk.jpg",
        preview: false,
      },
      {
        spotId: 6,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528643/Gemini_Generated_Image_njtihmnjtihmnjti_1_wqn1qk.jpg",
        preview: false,
      },
      {
        spotId: 7,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528645/Gemini_Generated_Image_sgzn2rsgzn2rsgzn_ili7xo.jpg",
        preview: true,
      },
      {
        spotId: 7,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528645/Gemini_Generated_Image_sgzn2rsgzn2rsgzn_ili7xo.jpg",
        preview: false,
      },
      {
        spotId: 7,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528645/Gemini_Generated_Image_sgzn2rsgzn2rsgzn_ili7xo.jpg",
        preview: false,
      },
      {
        spotId: 7,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528645/Gemini_Generated_Image_sgzn2rsgzn2rsgzn_ili7xo.jpg",
        preview: false,
      },
      {
        spotId: 8,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528637/Gemini_Generated_Image_9jv8yg9jv8yg9jv8_vpqvno.jpg",
        preview: true,
      },
      {
        spotId: 8,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528637/Gemini_Generated_Image_9jv8yg9jv8yg9jv8_vpqvno.jpg",
        preview: false,
      },
      {
        spotId: 8,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528637/Gemini_Generated_Image_9jv8yg9jv8yg9jv8_vpqvno.jpg",
        preview: false,
      },
      {
        spotId: 8,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528637/Gemini_Generated_Image_9jv8yg9jv8yg9jv8_vpqvno.jpg",
        preview: false,
      },
      {
        spotId: 9,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528646/Gemini_Generated_Image_t39fwzt39fwzt39f_gbx296.jpg",
        preview: true,
      },
      {
        spotId: 9,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528646/Gemini_Generated_Image_t39fwzt39fwzt39f_gbx296.jpg",
        preview: false,
      },
      {
        spotId: 9,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528646/Gemini_Generated_Image_t39fwzt39fwzt39f_gbx296.jpg",
        preview: false,
      },
      {
        spotId: 9,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528646/Gemini_Generated_Image_t39fwzt39fwzt39f_gbx296.jpg",
        preview: false,
      },
      {
        spotId: 10,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528647/Gemini_Generated_Image_t39fx1t39fx1t39f_1_giwckn.jpg",
        preview: true,
      },
      {
        spotId: 10,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528647/Gemini_Generated_Image_t39fx1t39fx1t39f_1_giwckn.jpg",
        preview: false,
      },
      {
        spotId: 10,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528647/Gemini_Generated_Image_t39fx1t39fx1t39f_1_giwckn.jpg",
        preview: false,
      },
      {
        spotId: 10,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528647/Gemini_Generated_Image_t39fx1t39fx1t39f_1_giwckn.jpg",
        preview: false,
      },
      {
        spotId: 11,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528649/pixlr-image-generator-3ca753ad-4e50-421d-ae58-667e1e9b454b_knnt7a.png",
        preview: true,
      },
      {
        spotId: 11,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528649/pixlr-image-generator-3ca753ad-4e50-421d-ae58-667e1e9b454b_knnt7a.png",
        preview: false,
      },
      {
        spotId: 11,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528649/pixlr-image-generator-3ca753ad-4e50-421d-ae58-667e1e9b454b_knnt7a.png",
        preview: false,
      },
      {
        spotId: 11,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528649/pixlr-image-generator-3ca753ad-4e50-421d-ae58-667e1e9b454b_knnt7a.png",
        preview: false,
      },
      {
        spotId: 12,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528639/Gemini_Generated_Image_86qlsz86qlsz86ql_aavw56.jpg",
        preview: true,
      },
      {
        spotId: 12,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528639/Gemini_Generated_Image_86qlsz86qlsz86ql_aavw56.jpg",
        preview: false,
      },
      {
        spotId: 12,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528639/Gemini_Generated_Image_86qlsz86qlsz86ql_aavw56.jpg",
        preview: false,
      },
      {
        spotId: 12,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528639/Gemini_Generated_Image_86qlsz86qlsz86ql_aavw56.jpg",
        preview: false,
      },
      {
        spotId: 13,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528640/Gemini_Generated_Image_fnogvafnogvafnog_t0vsgi.jpg",
        preview: true,
      },
      {
        spotId: 13,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528640/Gemini_Generated_Image_fnogvafnogvafnog_t0vsgi.jpg",
        preview: false,
      },
      {
        spotId: 13,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528640/Gemini_Generated_Image_fnogvafnogvafnog_t0vsgi.jpg",
        preview: false,
      },
      {
        spotId: 13,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528640/Gemini_Generated_Image_fnogvafnogvafnog_t0vsgi.jpg",
        preview: false,
      },
      {
        spotId: 14,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528644/Gemini_Generated_Image_njtihmnjtihmnjti_ecadmu.jpg",
        preview: true,
      },
      {
        spotId: 14,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528644/Gemini_Generated_Image_njtihmnjtihmnjti_ecadmu.jpg",
        preview: false,
      },
      {
        spotId: 14,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528644/Gemini_Generated_Image_njtihmnjtihmnjti_ecadmu.jpg",
        preview: false,
      },
      {
        spotId: 14,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528644/Gemini_Generated_Image_njtihmnjtihmnjti_ecadmu.jpg",
        preview: false,
      },
      {
        spotId: 15,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528649/Gemini_Generated_Image_t39fx2t39fx2t39f_e1dlq0.jpg",
        preview: true,
      },
      {
        spotId: 15,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528649/Gemini_Generated_Image_t39fx2t39fx2t39f_e1dlq0.jpg",
        preview: false,
      },
      {
        spotId: 15,
        url: "https://res.cloudinary.com/dnzxq7dgk/image/upload/v1683575622/App%20Academy%20Front%20End%20Project/15_treehouse_retreat/interior_gghhfg.jpg",
        preview: false,
      },
      {
        spotId: 15,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528649/Gemini_Generated_Image_t39fx2t39fx2t39f_e1dlq0.jpg",
        preview: false,
      },
      {
        spotId: 16,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528643/Gemini_Generated_Image_njtihmnjtihmnjti_2_sc7p6d.jpg",
        preview: true,
      },
      {
        spotId: 16,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528643/Gemini_Generated_Image_njtihmnjtihmnjti_2_sc7p6d.jpg",
        preview: false,
      },
      {
        spotId: 16,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528643/Gemini_Generated_Image_njtihmnjtihmnjti_2_sc7p6d.jpg",
        preview: false,
      },
      {
        spotId: 17,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528642/Gemini_Generated_Image_njtihlnjtihlnjti_ffxue4.jpg",
        preview: true,
      },
      {
        spotId: 17,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528642/Gemini_Generated_Image_njtihlnjtihlnjti_ffxue4.jpg",
        preview: false,
      },
      {
        spotId: 17,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528642/Gemini_Generated_Image_njtihlnjtihlnjti_ffxue4.jpg",
        preview: false,
      },
      {
        spotId: 18,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528637/Gemini_Generated_Image_9jv8yg9jv8yg9jv8_vpqvno.jpg",
        preview: true,
      },
      {
        spotId: 18,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528637/Gemini_Generated_Image_9jv8yg9jv8yg9jv8_vpqvno.jpg",
        preview: false,
      },
      {
        spotId: 18,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528637/Gemini_Generated_Image_9jv8yg9jv8yg9jv8_vpqvno.jpg",
        preview: false,
      },
      {
        spotId: 19,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528639/Gemini_Generated_Image_fnogv9fnogv9fnog_lnposx.jpg",
        preview: true,
      },
      {
        spotId: 19,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528639/Gemini_Generated_Image_fnogv9fnogv9fnog_lnposx.jpg",
        preview: false,
      },
      {
        spotId: 19,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528639/Gemini_Generated_Image_fnogv9fnogv9fnog_lnposx.jpg",
        preview: false,
      },
      {
        spotId: 20,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528636/Gemini_Generated_Image_8fjgsw8fjgsw8fjg_nogcg1.jpg",
        preview: true,
      },
      {
        spotId: 20,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528636/Gemini_Generated_Image_8fjgsw8fjgsw8fjg_nogcg1.jpg",
        preview: false,
      },
      {
        spotId: 20,
        url: "https://res.cloudinary.com/dr2lpm5b4/image/upload/v1717528636/Gemini_Generated_Image_8fjgsw8fjgsw8fjg_nogcg1.jpg",
        preview: false,
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
