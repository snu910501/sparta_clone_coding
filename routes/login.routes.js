const express = require('express');
const router = express.Router();

const LoginController = require('../controllers/login.controller.js');
const loginController = new LoginController()


router.post('/', loginController.login)
router.post('/kakao', loginController.kakaoLogin);

module.exports = router;