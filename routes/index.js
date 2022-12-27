const express = require("express");
const router = express.Router();

const signupRouter = require("./signup.routes");
const loginRouter = require("./login.routes");
const postRouter = require("./post.routes");
const commentRouter = require("./comment.routes");
const path = require('path');

router.use("/login", loginRouter);
router.use("/signup", signupRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);
// router.use('/auth', authRouter);

// --> 변경 (샘플페이지용 라우터 지워도 됨)
router.get('/socket-chatting', (req, res) => {
    res.sendFile(path.join(__dirname, '/../views/sample-socket.html'));
});

module.exports = router;
