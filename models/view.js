const Sequelize = require("sequelize");

module.exports = class View extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          allowNull: true,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        address: {
          type: Sequelize.STRING(),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        modelName: "View",
        tableName: "views",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.View.belongsTo(db.Post, {
      foreignKey: "postId",
      targetKey: "postId",
    });
  }
};
