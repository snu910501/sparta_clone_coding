const express = require('express');
const router = express.Router();

const signupRouter = require("./signup.routes");

router.use('/signup', signupRouter)

module.exports = router;