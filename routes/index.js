const express = require("express");
const router = express.Router();

const signupRouter = require("./signup.routes");
const loginRouter = require("./login.routes");
const postRouter = require("./post.routes");
const commentRouter = require("./comment.routes");

router.use("/login", loginRouter);
router.use("/signup", signupRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);

module.exports = router;
