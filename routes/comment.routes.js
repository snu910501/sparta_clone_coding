const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const CommentController = require("../controllers/comment.controller");
const cmtController = new CommentController();

router.post("/post/:postId/", authMiddleware, cmtController.createComment);
router.patch(
  "/:commentId/post/:postId",
  authMiddleware,
  cmtController.updateComment
);
router.delete(
  "/:commentId/post/:postId",
  authMiddleware,
  cmtController.deleteComment
);

module.exports = router;
