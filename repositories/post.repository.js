const Post = require("../models/post");

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

  //   getPosts = async();
}

module.exports = PostRepository;
