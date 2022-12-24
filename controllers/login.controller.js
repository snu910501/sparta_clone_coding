const LoginService = require('../services/login.service');

class LoginController {
  loginController = new LoginService();

  login = async (req, res, next) => {
    try {
      let email = req.body.email;
      let password = req.body.password;

      let Token = await this.loginController.login(email, password);
      return res.status(200).json({
        result: true,
        token: Token,
      })
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ errorMessage: err.errorMessage })
    }
  };

  kakaoLogin = async (req, res, next) => {
    try {
      const { id, nickname, email } = req.body;
      let Token = await this.loginController.login(email, id, nickname);
      return res.status(200).json({ result: true, token: Token })
    } catch (err) {
      return res.status(err.status).json({ errorMessage: err.errorMessage })
    }
  }

}

module.exports = LoginController