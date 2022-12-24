const Sequelize = require("sequelize");

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        postId: {
          allowNull: true,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        title: {
          type: Sequelize.STRING(),
          allowNull: true,
        },
        content: {
          allowNull: true,
          type: Sequelize.STRING(),
        },
        tag: {
          type: Sequelize.STRING(),
          allowNull: true,
        },
        view: {
          type: Sequelize.INTEGER(),
          defaultValue: 0,
        },
        compVid: {
          type: Sequelize.STRING(),
          allowNull: true,
        },
        origVid: {
          type: Sequelize.STRING(),
          allowNull: true,
        },
        thumbnail: {
          type: Sequelize.STRING(),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        modelName: "Post",
        tableName: "posts",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "userId",
    });
  }
};
