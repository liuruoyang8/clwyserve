'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // const forms = [];
    // const counts = 10;

    // for (let i = 1; i <= counts; i++) {
    //   const article = {
    //     lable: `test ${i}`,
    //     value: `value ${i}`,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   };

    //   forms.push(article);
    // }

    await queryInterface.bulkInsert('Forms', [{
      lable: `test`,
      value: `value`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Forms', null, {});
  }
};
