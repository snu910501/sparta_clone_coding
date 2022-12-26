const PostService = require("../services/post.service");
const getUserIP = require("../middlewares/getUserIP");
class PostController {
  postService = new PostService();

  createPost = async (req, res) => {
    try {
      const userId = res.locals.user.dataValues.userId;
      const { title, content, tag } = req.body;
      const vid = req.file;

      await this.postService.createPost(title, content, tag, vid, userId);
      return res.status(200).json({ message: "영상 업로드 성공" });
    } catch (err) {
      return res.status(err.status).json({ errorMessage: err.errorMessage });
    }
  };

  findAllPost = async (req, res) => {
    try {
      const lastId = req.query.lastId;
      const allPosts = await this.postService.findAllPost(lastId);
      return res.status(200).json({ posts: allPosts });
    } catch (err) {
      return res.status(err.status).json({ errorMessage: err.errorMessage });
    }
  };

  findPost = async (req, res) => {
    try {
      const postId = req.params.postId;

      // 조회수 +1은 postId+IP 주소 쿠키 존재 여부로 확인
      if (req.cookies[postId] == undefined) {
        res.cookie(postId, getUserIP(req), {
          maxAge: 24 * 60 * 60 * 1000,
        });

        await this.postService.addView(postId);
      }

      const post = await this.postService.findPost(postId);

      return res.status(200).json({ post: post });
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ errorMessage: err.errorMessage });
    }
  };

  updatePost = async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = res.locals.user.dataValues.userId;
      const { title, content, tag } = req.body;

      await this.postService.updatePost(userId, postId, title, content, tag);
      return res.status(200).json({ message: "영상 수정 성공" });
    } catch (err) {
      return res.status(err.status).json({ errorMessage: err.errorMessage });
    }
  };

  deletePost = async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = res.locals.user.dataValues.userId;

      await this.postService.deletePost(userId, postId);
      return res.status(200).json({ message: "영상 삭제 성공" });
    } catch (err) {
      return res.status(err.status).json({ errorMessage: err.errorMessage });
    }
  };
}

module.exports = PostController;
