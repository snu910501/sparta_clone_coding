const PostRepository = require("../repositories/post.repository");
const CommentRepository = require("../repositories/comment.repository");
const uploadVidToS3 = require("../middlewares/uploadVidToS3");
const ErrorMiddleware = require("../middlewares/errorMiddleware");
const dateCalculator = require("../middlewares/dateCalculator");

class PostService {
  postRepository = new PostRepository();
  cmtRepository = new CommentRepository();

  createPost = async (title, content, tag, vid, userId) => {
    try {
      if (!title || !content || !vid)
        throw new ErrorMiddleware(406, "제목 내용 또는 영상 없음");

      const { compVid, origVid, thumbnail } = await uploadVidToS3(vid);

      const create = await this.postRepository.createPost(
        title,
        content,
        tag,
        compVid,
        origVid,
        thumbnail,
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
      allPosts.map((post) => {
        post.createdAt = dateCalculator(post.createdAt);
        return post;
      });

      return allPosts;
    } catch (err) {
      throw err;
    }
  };

  searchKeyword = async (keyword, lastId) => {
    try {
      if (!keyword) throw new ErrorMiddleware(406, "검색어 없음");
      const posts = await this.postRepository.searchKeyword(keyword, lastId);
      posts.map((post) => {
        const date = post.createdAt;
        post.createdAt = date.toLocaleDateString();
        return post;
      });

      return posts;
    } catch (err) {
      throw err;
    }
  };

  searchTag = async (tag, lastId) => {
    try {
      if (!tag) throw new ErrorMiddleware(406, "태그 없음");
      const posts = await this.postRepository.searchTag(tag, lastId);
      posts.map((post) => {
        post.createdAt = dateCalculator(post.createdAt);
        return post;
      });

      return posts;
    } catch (err) {
      console.log(err);
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

      // 날짜 YYYY. MM. DD. 로 변환
      const date = post.updatedAt;
      post.updatedAt = date.toLocaleDateString();

      // 댓글 작성 날짜 ~~전으로 변경
      const comments = await this.cmtRepository.findAllComments(postId);
      comments.map((comment) => {
        comment.createdAt = dateCalculator(comment.createdAt);
        return comment;
      });

      // 결과 합치기
      const result = { ...post, comments: comments };

      return result;
    } catch (err) {
      throw err;
    }
  };

  updatePost = async (userId, postId, title, content, tag) => {
    try {
      const findPost = await this.postRepository.findPost(postId);
      if (!findPost) throw new ErrorMiddleware(404, "영상 없음");

      if (findPost.userId != userId)
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

      if (findPost.userId != userId)
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
