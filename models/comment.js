const Sequelize = require("sequelize");

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        commentId: {
          allowNull: true,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        comment: {
          allowNull: true,
          type: Sequelize.STRING(),
        },
      },
      {
        sequelize,
        timestamps: true,
        modelName: "Comment",
        tableName: "comments",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Comment.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "userId",
    });
    db.Comment.belongsTo(db.Post, {
      foreignKey: "postId",
      targetKey: "postId",
    });
  }
};
