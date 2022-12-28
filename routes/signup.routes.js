const express = require('express');
const router = express.Router();
const multer = require('multer');

const SignupController = require("../controllers/signup.controller");
const signupController = new SignupController();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

router.post('/', upload.single('profileImg', 1), signupController.registerUser);
router.post('/emailcheck', signupController.checkEmail);
router.post('/kakao', signupController.registerKakaoUser)

module.exports = router;