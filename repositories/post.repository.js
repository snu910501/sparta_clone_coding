const { Post, User, View } = require("../models/");
const { Sequelize, Op } = require("sequelize");

class PostRepository {
  createPost = async (
    title,
    content,
    tag,
    compVid,
    origVid,
    thumbnail,
    userId
  ) => {
    try {
      const post = await Post.create({
        title,
        content,
        tag,
        compVid,
        origVid,
        thumbnail,
        userId,
      });
      return post;
    } catch (err) {
      throw err;
    }
  };

  findAllPost = async (lastId) => {
    try {
      const where = {};
      if (parseInt(lastId, 10)) {
        where.postId = { [Op.lt]: lastId };
      }

      const allPosts = await Post.findAll({
        where,
        subQuery: false,
        limit: 16,
        attributes: [
          "postId",
          "title",
          "thumbnail",
          "compVid",
          [Sequelize.col("User.nickname"), "nickname"],
          [Sequelize.col("User.imageUrl"), "profile"],
          "createdAt",
          [Sequelize.fn("COUNT", Sequelize.col("Views.postId")), "view"],
        ],
        include: [
          { model: User, attributes: [] },
          { model: View, as: "Views", attributes: [] },
        ],
        group: "postId",
        order: [["createdAt", "DESC"]],
        raw: true,
      });

      return allPosts;
    } catch (err) {
      throw err;
    }
  };

  searchKeyword = async (keyword) => {
    try {
      const posts = await Post.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${keyword}%` } },
            { content: { [Op.like]: `%${keyword}%` } },
          ],
        },
        subQuery: false,
        limit: 16,
        attributes: [
          "postId",
          "title",
          "content",
          "thumbnail",
          "compVid",
          [Sequelize.col("User.nickname"), "nickname"],
          [Sequelize.col("User.imageUrl"), "profile"],
          "createdAt",
          [Sequelize.fn("COUNT", Sequelize.col("Views.postId")), "view"],
        ],
        include: [
          { model: User, attributes: [] },
          { model: View, as: "Views", attributes: [] },
        ],
        group: "postId",
        order: [["createdAt", "DESC"]],
        raw: true,
      });

      return posts;
    } catch (err) {
      throw err;
    }
  };

  searchTag = async (tag) => {
    try {
      const posts = await Post.findAll({
        where: { tag: { [Op.like]: `%${tag}%` } },
        subQuery: false,
        limit: 16,
        attributes: [
          "postId",
          "title",
          "thumbnail",
          "compVid",
          [Sequelize.col("User.nickname"), "nickname"],
          [Sequelize.col("User.imageUrl"), "profile"],
          "createdAt",
          [Sequelize.fn("COUNT", Sequelize.col("Views.postId")), "view"],
        ],
        include: [
          { model: User, attributes: [] },
          { model: View, as: "Views", attributes: [] },
        ],
        group: "postId",
        order: [["createdAt", "DESC"]],
        raw: true,
      });

      return posts;
    } catch (err) {
      throw err;
    }
  };

  findPost = async (postId) => {
    try {
      const post = await Post.findOne({
        where: { postId: postId },
        attributes: [
          "postId",
          "title",
          "content",
          "thumbnail",
          "tag",
          "origVid",
          [Sequelize.col("User.nickname"), "nickname"],
          [Sequelize.col("User.userId"), "userId"],
          [Sequelize.col("User.imageUrl"), "profile"],
          "updatedAt",
          [Sequelize.fn("COUNT", Sequelize.col("Views.postId")), "view"],
        ],
        include: [
          { model: User, attributes: [] },
          { model: View, as: "Views", attributes: [] },
        ],
        raw: true,
      });
      return post;
    } catch (err) {
      throw err;
    }
  };

  updatePost = async (postId, title, content, tag) => {
    try {
      const post = await Post.update(
        { title, content, tag },
        { where: { postId: postId } }
      );
      return post;
    } catch (err) {
      throw err;
    }
  };

  deletePost = async (postId) => {
    try {
      const post = await Post.destroy({ where: { postId: postId } });
      return post;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = PostRepository;
