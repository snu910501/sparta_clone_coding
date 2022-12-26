const CommentRepository = require("../repositories/comment.repository");
const PostRepository = require("../repositories/post.repository");
const ErrorMiddleware = require("../middlewares/errorMiddleware");

class CommentService {
  cmtRepository = new CommentRepository();
  postRepository = new PostRepository();

  createComment = async (comment, postId, userId) => {
    try {
      if (!comment) throw new ErrorMiddleware(406, "댓글 없음");

      // 댓글 쓰려는 영상 있는지 확인
      const post = await this.postRepository.findPost(postId);
      if (!post) throw new ErrorMiddleware(404, "영상 없음");

      const create = await this.cmtRepository.createComment(
        comment,
        postId,
        userId
      );
      return create;
    } catch (err) {
      throw err;
    }
  };

  updateComment = async (userId, postId, commentId, comment) => {
    try {
      if (!comment) throw new ErrorMiddleware(406, "댓글 없음");

      // 댓글 수정하려는 영상 있는지 확인
      const post = await this.postRepository.findPost(postId);
      if (!post) throw new ErrorMiddleware(404, "영상 없음");

      // 댓글 주인인지 확인
      const findComment = await this.cmtRepository.findComment(commentId);
      if (findComment.dataValues.userId != userId)
        throw new ErrorMiddleware(403, "댓글 주인 아님");

      const cmt = await this.cmtRepository.updateComment(commentId, comment);

      return cmt;
    } catch (err) {
      throw err;
    }
  };

  deleteComment = async (userId, postId, commentId) => {
    try {
      // 댓글 수정하려는 영상 있는지 확인
      const post = await this.postRepository.findPost(postId);
      if (!post) throw new ErrorMiddleware(404, "영상 없음");

      // 댓글 주인인지 확인
      const findComment = await this.cmtRepository.findComment(commentId);
      if (findComment.dataValues.userId != userId)
        throw new ErrorMiddleware(403, "댓글 주인 아님");

      const cmt = await this.cmtRepository.deleteComment(commentId);

      return cmt;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = CommentService;
