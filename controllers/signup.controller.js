const { signupValidate } = require('../middlewares/signupValidate');
const SignupService = require('../services/signup.service');


class SignupController {
  signupService = new SignupService();

  checkEmail = async (req, res, next) => {
    try {
      const email = req.body.email
      const emailExist = await this.signupService.checkEmail(email);

      if (emailExist == true) {
        return res.status(200).json({ message: '가입 가능한 이메일입니다.' })
      } else {
        return res.status(502).json({ errorMessage: '가입 불가능한 이메일입니다.' })
      }
    } catch (err) {
      return res.status(err.status).json({ errorMessage: err.errorMessage })
    }
  };

  registerUser = async (req, res, next) => {
    // 이메일 중복검사 했나 안했나 확인하는 변수 emailValidate. true여야 다음 로직 실행
    console.log(req.body.email, req.body.password, req.body.nickname, req.body.emailValidate)
    // try {
    //   const { email, nickname, password, passwordConfirm, emailValidate } = req.body;

    //   if (emailValidate == true) {
    //     await this.signupService.registerUser(email, nickname, password, passwordConfirm);
    //     return res.status(200).json({ message: '회원가입 성공' })
    //   } else {
    //     return res.status(502).json({ errorMessage: '이메일 중복확인을 먼저 하세여.' })
    //   }
    // } catch (err) {
    //   return res.status(err.status).json({ errorMessage: err.errorMessage })
    // }

  }
}

module.exports = SignupController;