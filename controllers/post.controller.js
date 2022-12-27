const PostService = require("../services/post.service");
const ViewService = require("../services/view.service");
const getUserIP = require("../middlewares/getUserIP");
class PostController {
  postService = new PostService();
  viewService = new ViewService();

  createPost = async (req, res) => {
    try {
      const userId = res.locals.user.dataValues.userId;
      const { title, content, tag } = req.body;
      const vid = req.file;

      await this.postService.createPost(title, content, tag, vid, userId);
      return res.status(200).json({ message: "영상 업로드 성공" });
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ errorMessage: err.errorMessage });
      } else {
        return res.status(500).json({ errorMessage: "error" });
      }
    }
  };

  findAllPost = async (req, res) => {
    try {
      const lastId = req.query.lastId;
      const allPosts = await this.postService.findAllPost(lastId);
      return res.status(200).json({ posts: allPosts });
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ errorMessage: err.errorMessage });
      } else {
        return res.status(500).json({ errorMessage: "error" });
      }
    }
  };

  findPost = async (req, res, next) => {
    try {
      const postId = req.params.postId;
      if (postId === "search") next();
      else {
        // 조회수 추가 또는 검증
        const address = getUserIP(req);
        await this.viewService.viewCount(address, postId);

        const post = await this.postService.findPost(postId);
        return res.status(200).json({ post: post });
      }
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ errorMessage: err.errorMessage });
      } else {
        return res.status(500).json({ errorMessage: "error" });
      }
    }
  };

  searchKeyword = async (req, res, next) => {
    try {
      const keyword = req.query.keyword;
      if (req.query.tag) next();
      else {
        const posts = await this.postService.searchKeyword(keyword);
        return res.status(200).json({ posts: posts });
      }
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ errorMessage: err.errorMessage });
      } else {
        return res.status(500).json({ errorMessage: "error" });
      }
    }
  };

  searchTag = async (req, res, next) => {
    try {
      const tag = req.query.tag;
      const posts = await this.postService.searchTag(tag);
      return res.status(200).json({ posts: posts });
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ errorMessage: err.errorMessage });
      } else {
        return res.status(500).json({ errorMessage: "error" });
      }
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
      if (err.status) {
        return res.status(err.status).json({ errorMessage: err.errorMessage });
      } else {
        return res.status(500).json({ errorMessage: "error" });
      }
    }
  };

  deletePost = async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = res.locals.user.dataValues.userId;

      await this.postService.deletePost(userId, postId);
      return res.status(200).json({ message: "영상 삭제 성공" });
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ errorMessage: err.errorMessage });
      } else {
        return res.status(500).json({ errorMessage: "error" });
      }
    }
  };
}

module.exports = PostController;
