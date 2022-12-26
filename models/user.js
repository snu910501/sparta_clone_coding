const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          allowNull: true,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        email: {
          // unique: true,
          type: Sequelize.STRING(45),
          allowNull: true,
        },
        nickname: {
          unique: true,
          allowNull: false,
          type: Sequelize.STRING(45),
        },
        password: {
          type: Sequelize.STRING(60),
          allowNull: true,
        },
        provider: {
          type: Sequelize.STRING(10),
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        modelName: "User",
        tableName: "users",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post, {
      foreignKey: "userId",
      sourceKey: "userId",
    });
    db.User.hasMany(db.Comment, {
      foreignKey: "userId",
      sourceKey: "userId",
    });
  }
};
