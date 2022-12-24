const { signupValidate } = require('../middlewares/signupValidate');
const SignupService = require('../services/signup.service');


class SignupController {
  signupService = new SignupService();

  checkEmail = async (req, res, next) => {
    try {
      const { email } = req.body
      const emailExist = await this.signupService.checkEmail(email);

      if (emailExist == true) {
        return res.status(200).json({ message: '가입 가능한 이메일입니다.' })
      } else {
        return res.status(502).json({ errorMessage: '가입 불가능한 이메일입니다.' })
      }
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ errorMessage: err.errorMessage })
      } else {
        return res.status(500).json({ errorMessage: err })
      }
    }
  };

  registerUser = async (req, res, next) => {
    // 이메일 중복검사 했나 안했나 확인하는 변수 emailValidate. true여야 다음 로직 실행

    try {
      const { email, nickname, password, passwordConfirm, emailValidate } = req.body;
      if (emailValidate == true) {
        await this.signupService.registerUser(email, nickname, password, passwordConfirm);
        return res.status(200).json({ message: '회원가입 성공' })
      } else {
        return res.status(502).json({ errorMessage: '이메일 중복확인을 먼저 하세여.' })
      }
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ errorMessage: err.errorMessage })
      } else {
        return res.status(500).json({ errorMessage: err })
      }
    }
  };

  registerKakaoUser = async (req, res, next) => {
    try {
      const { email, nickname, snsId } = req.body;

      let data = await this.signupService.registerKakaoUser(email, nickname, snsId)
      if (typeof data == String) {
        return res.status(200).json({ message: '회원가입 성공' })
      } else {
        return res.status(200).json({ result: true, token: data })
      }

    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ errorMessage: err.errorMessage })
      } else {
        return res.status(500).json({ errorMessage: err })
      }

    }
  }
}

module.exports = SignupController;