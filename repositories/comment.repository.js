const { Comment, User } = require("../models/");
const Sequelize = require("sequelize");

class CommentRepository {
  createComment = async (comment, postId, userId) => {
    try {
      const create = await Comment.create({
        comment,
        postId,
        userId,
      });
      return create;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  findComment = async (commentId) => {
    try {
      const comment = await Comment.findOne({
        where: { commentId: commentId },
      });
      return comment;
    } catch (err) {}
  };

  findAllComments = async (postId) => {
    try {
      const allComments = await Comment.findAll({
        where: { postId: postId },
        attributes: [
          "commentId",
          "comment",
          [Sequelize.col("User.nickname"), "nickname"],
          "createdAt",
        ],
        include: [{ model: User, attributes: [] }],
        group: "commentId",
        order: [["createdAt", "ASC"]],
        raw: true,
      });

      return allComments;
    } catch (err) {
      throw err;
    }
  };

  updateComment = async (commentId, comment) => {
    try {
      const cmt = await Comment.update(
        { comment },
        { where: { commentId: commentId } }
      );
      return cmt;
    } catch (err) {
      throw err;
    }
  };

  deleteComment = async (commentId) => {
    try {
      const cmt = await Comment.destroy({ where: { commentId: commentId } });
      return cmt;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = CommentRepository;
