const PostRepository = require("../repositories/post.repository");
const CommentRepository = require("../repositories/comment.repository");
const uploadVidToS3 = require("../middlewares/uploadVidToS3");
const uploadImageToS3 = require("../middlewares/uploadImageToS3");
const ErrorMiddleware = require("../middlewares/errorMiddleware");

class PostService {
  postRepository = new PostRepository();
  cmtRepository = new CommentRepository();

  createPost = async (title, content, tag, vid, userId) => {
    try {
      if (!title || !content || !vid)
        throw new ErrorMiddleware(406, "제목 내용 또는 영상 없음");

      const origVid = await uploadVidToS3(vid);
      const create = await this.postRepository.createPost(
        title,
        content,
        tag,
        origVid,
        // thumbnail,
        userId
      );
      return create;
    } catch (err) {
      throw err;
    }
  };

  findAllPost = async (lastId) => {
    try {
      const allPosts = await this.postRepository.findAllPost(lastId);
      return allPosts;
    } catch (err) {
      throw err;
    }
  };

  findPost = async (postId) => {
    try {
      if (postId == "undefined" || postId == "[object Object]") {
        throw new ErrorMiddleware(401, ` ${postId} undefined 들어왔음`);
      }
      const post = await this.postRepository.findPost(postId);
      if (!post) throw new ErrorMiddleware(404, "영상 없음");

      const comments = await this.cmtRepository.findAllComments(postId);
      const result = { ...post.dataValues, comments: comments };

      return result;
    } catch (err) {
      throw err;
    }
  };

  updatePost = async (userId, postId, title, content, tag) => {
    try {
      const findPost = await this.postRepository.findPost(postId);
      if (!findPost) throw new ErrorMiddleware(404, "영상 없음");

      if (findPost.dataValues.userId != userId)
        throw new ErrorMiddleware(403, "영상 주인 아님");

      const post = await this.postRepository.updatePost(
        postId,
        title,
        content,
        tag
      );
      return post;
    } catch (err) {
      throw err;
    }
  };

  deletePost = async (userId, postId) => {
    try {
      const findPost = await this.postRepository.findPost(postId);
      if (!findPost) throw new ErrorMiddleware(404, "영상 없음");

      if (findPost.dataValues.userId != userId)
        throw new ErrorMiddleware(403, "영상 주인 아님");

      const post = await this.postRepository.deletePost(postId);
      return post;
    } catch (err) {
      throw err;
    }
  };

  addView = async (postId) => {
    try {
      const addView = await this.postRepository.addView(postId);
      return addView;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = PostService;
