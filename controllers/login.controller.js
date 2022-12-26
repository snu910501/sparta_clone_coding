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
      const code = req.body.code
      console.log('codezz', code);
      const {
        data: { access_token: kakaoAccessToken },
      } = await axios('https://kauth.kakao.com/oauth/token', {
        params: {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_uri: process.env.KAKAO_REDIRECT_URI + '?platform=kakao',
          code: code,
        },
      }); //액세스 토큰을 받아온다

      console.log(data)
      return res.status(200).json({ result: true, token: Token })
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ errorMessage: err.errorMessage })
      } else {
        return res.status(500).json({ errorMessage: err })
      }
    }
  }
}

module.exports = LoginController