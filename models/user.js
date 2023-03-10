const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          allowNull: false,
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
          allowNull: true,
          type: Sequelize.STRING(45),
        },
        password: {
          type: Sequelize.STRING(60),
          allowNull: true,
          defaultValue: null,
        },
        provider: {
          type: Sequelize.STRING(10),
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        imageUrl: {
          type: Sequelize.STRING,
          allowNull: true,
        }
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
