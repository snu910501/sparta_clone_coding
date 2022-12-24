const express = require('express');
const router = express.Router();

const signupRouter = require("./signup.routes");
const loginRouter = require('./login.routes');

router.use('/login', loginRouter);
router.use('/signup', signupRouter);

module.exports = router;