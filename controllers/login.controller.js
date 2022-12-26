

const LoginService = require('../services/login.service');

class LoginController {
  loginService = new LoginService();

  login = async (req, res, next) => {
    try {
      let email = req.body.email;
      let password = req.body.password;

      let Token = await this.loginService.login(email, password);
      return res.status(200).json({
        result: true,
        token: Token,
      })
    } catch (err) {
      console.log('LoginController login error');
      if (err.status) {
        return res.status(err.status).json({ errorMessage: err.errorMessage })
      } else {
        return res.status(500).json({ errorMessage: 'error' })
      }
    }
  };

  kakaoLogin = async (req, res, next) => {
    try {
      const { code } = req.query
      let result = await this.loginService.kakaoLogin(code);

      return res.status(200).json({ result: result.result, token: result.token })
    } catch (err) {
      console.log('loginController kakaoLogin error');
      if (err.status) {
        return res.status(err.status).json({ errorMessage: err.errorMessage })
      } else {
        return res.status(500).json({ errorMessage: 'error' })
      }
    }
  }
}

module.exports = LoginController