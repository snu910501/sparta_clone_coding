const Sequelize = require('sequelize');

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
          type: Sequelize.STRING(60),
          allowNull: false,
        },
        content: {
          allowNull: false,
          type: Sequelize.STRING(60),
        },
        tag: {
          type: Sequelize.STRING(60),
          allowNull: true,
        },
        view: {
          type: Sequelize.NUMBER(10),
          defaultValue: 'local',
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
        }     
      },
      {
        sequelize,
        timestamps: false,
        modelName: 'Post',
        tableName: 'posts',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    this.belongsTo(models.User);
  }
};
