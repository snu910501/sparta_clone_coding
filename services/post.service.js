const PostRepository = require("../repositories/post.repository.js");
const uploadVidToS3 = require("../middlewares/uploadVidToS3.js");
const uploadImageToS3 = require("../middlewares/uploadImageToS3.js");
const ErrorMiddleware = require("../middlewares/errorMiddleware.js");

class PostService {
  postRepository = new PostRepository();

  createPost = async (title, content, tag, vid, userId) => {
    try {
      const origVid = await uploadVidToS3(vid);

      return await this.postRepository.createPost(
        title,
        content,
        tag,
        origVid,
        // thumbnail,
        userId
      );
    } catch (err) {
      throw err;
    }
  };

  findAllPost = async () => {
    try {
      const allPosts = await this.postRepository.findAllPost();
      return allPosts;
    } catch (err) {
      throw err;
    }
  };

  findPost = async (postId) => {
    try {
      if (postId == "undefined" || postId == "[object Object]") {
        const errorMiddleware = new ErrorMiddleware(
          401,
          ` ${postId} undefined 들어왔음`
        );
        throw errorMiddleware;
      }
      const post = await this.postRepository.findPost(postId);
      return post;
    } catch (err) {}
  };
}

module.exports = PostService;
