'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: '名称必须填写。' },
          notEmpty: { msg: '名称不能为空。' },
          len: { args: [2, 45], msg: '长度必须是2 ~ 45之间。' },
          async isUnique(value) {
            const category = await Category.findOne({ where: { name: value } })
            if (category) {
              throw new Error('名称已存在，请选择其他名称。');
            }
          }
        }
      },
      
      // name: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   unique: { msg: '名称已存在，请选择其他名称。' },
      //   validate: {
      //     notNull: { msg: '名称必须填写。' },
      //     notEmpty: { msg: '名称不能为空。' },
      //     len: { args: [2, 45], msg: '长度必须是2 ~ 45之间。' }
      //   }
      // },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: '排序必须填写。' },
          notEmpty: { msg: '排序不能为空。' },
          isInt: { msg: '排序必须为整数。' },
          isPositive(value) {
            if (value <= 0) {
              throw new Error('排序必须是正整数。');
            }
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Categories');
  }
};