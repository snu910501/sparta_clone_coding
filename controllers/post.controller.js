const PostService = require("../services/post.service");

class PostController {
  postService = new PostService();

  createPost = async (req, res) => {
    try {
      const userId = 1;
      const { title, content, tag } = req.body;
      const vid = req.file;

      await this.postService.createPost(title, content, tag, vid, userId);
      res.status(200).json({ message: "게시글 작성 성공" });
    } catch (err) {
      //   return res.status(err.status).json({ errorMessage: err.errorMessage });
      throw err;
    }
  };

  findAllPost = async (req, res) => {
    try {
      const allPosts = await this.postService.findAllPost();
      res.status(200).json({ posts: allPosts });
    } catch (err) {
      throw err;
    }
  };

  findPost = async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await this.postService.findPost(postId);
      res.status(200).json({ post: post });
    } catch (err) {
      throw err;
    }
  };
}

module.exports = PostController;