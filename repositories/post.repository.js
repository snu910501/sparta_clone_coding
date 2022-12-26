const { Post, User } = require("../models/");
const { Sequelize, Op } = require("sequelize");

class PostRepository {
  createPost = async (
    title,
    content,
    tag,
    // compVid,
    origVid,
    // thumbnail,
    userId
  ) => {
    try {
      const post = await Post.create({
        title,
        content,
        tag,
        // compVid,
        origVid,
        // thumbnail,
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
        limit: 16,
        attributes: [
          "postId",
          "title",
          "thumbnail",
          // "compVid",
          [Sequelize.col("origVid"), "compVid"], // 압축 시도 전까지 원본 송출
          [Sequelize.col("User.nickname"), "nickname"],
          "createdAt",
          "view",
        ],
        include: [{ model: User, attributes: [] }],
        group: "postId",
        order: [["createdAt", "DESC"]],
      });

      return allPosts;
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
          "view",
          "content",
          "thumbnail",
          "tag",
          "origVid",
          [Sequelize.col("User.nickname"), "nickname"],
          [Sequelize.col("User.userId"), "userId"],
          "updatedAt",
        ],
        include: [{ model: User, attributes: [] }],
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
