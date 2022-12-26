const CommentService = require("../services/comment.service");

class CommentController {
  cmtService = new CommentService();

  createComment = async (req, res) => {
    try {
      const userId = res.locals.user.dataValues.userId;
      const postId = req.params.postId;
      const comment = req.body.comment;

      await this.cmtService.createComment(comment, postId, userId);
      return res.status(200).json({ message: "댓글 업로드 성공" });
    } catch (err) {
      return res.status(err.status).json({ errorMessage: err.errorMessage });
    }
  };

  updateComment = async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const postId = req.params.postId;
      const userId = res.locals.user.dataValues.userId;
      const comment = req.body.comment;

      await this.cmtService.updateComment(userId, postId, commentId, comment);
      return res.status(200).json({ message: "댓글 수정 성공" });
    } catch (err) {
      return res.status(err.status).json({ errorMessage: err.errorMessage });
    }
  };

  deleteComment = async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const postId = req.params.postId;
      const userId = res.locals.user.dataValues.userId;

      await this.cmtService.deleteComment(userId, postId, commentId);
      return res.status(200).json({ message: "댓글 삭제 성공" });
    } catch (err) {
      return res.status(err.status).json({ errorMessage: err.errorMessage });
    }
  };
}

module.exports = CommentController;
