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
}

module.exports = PostService;
