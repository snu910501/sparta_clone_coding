const express = require('express');
const router = express.Router();

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

router.post('/', signupController.registerUser);
router.post('/emailcheck', upload.array('image', 1), signupController.checkEmail);

module.exports = router;