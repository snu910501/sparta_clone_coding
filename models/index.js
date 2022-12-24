const Sequelize = require("sequelize");
const User = require("./user");
const Post = require("./post");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

// 여기에다가 db객체에 모델들을 넣어주세요.
db.User = User;
db.Post = Post;

// 여기다가 각 모델의 init함수에 sequelize객체를 연결해주세요.
User.init(sequelize);
Post.init(sequelize);
User.associate(db);
Post.associate(db);

module.exports = db;
