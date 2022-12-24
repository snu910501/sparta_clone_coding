const { Post, User } = require("../models/");
const Sequelize = require("sequelize");

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

  findAllPost = async () => {
    try {
      const allPosts = await Post.findAll({
        attributes: [
          "postId",
          "title",
          "thumbnail",
          "compVid",
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
          "updatedAt",
        ],
        include: [{ model: User, attributes: [] }],
      });
      return post;
    } catch (err) {}
  };
}

module.exports = PostRepository;
