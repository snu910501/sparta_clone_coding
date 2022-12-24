const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middlewares/authMiddleware");

const PostController = require("../controllers/post.controller");
const postController = new PostController();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

router.get("/", postController.findAllPost);
router.post(
  "/",
  authMiddleware,
  upload.single("video"),
  postController.createPost
);
router.get("/:postId", postController.findPost);
router.patch("/:postId", postController.updatePost);
router.delete("/:postId", authMiddleware, postController.deletePost);

module.exports = router;
