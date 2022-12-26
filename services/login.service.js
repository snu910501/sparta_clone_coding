const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcrypt');
require('dotenv').config();
const LoginRepository = require('../repositories/login.repository');
const SignupRepository = require('../repositories/signup.repository');
const ErrorMiddleware = require('../middlewares/errorMiddleware');

class LoginService {
  loginRepository = new LoginRepository();
  signupRepository = new SignupRepository();

  login = async (email, password) => {
    try {
      // email, password 빈값으로 들어왔을 때 검사
      if (!email || !password || email == 'undefined' || password == 'undefined') {
        const errorMiddleware = new ErrorMiddleware(412, '똑바로 입력하세요 ^^');
        throw errorMiddleware;
      }

      const user = await this.loginRepository.login(email);

      if (user) {
        const passwordCheck = await bcrypt.compare(password, user.password)

        if (!passwordCheck) {
          const errorMiddleware = new ErrorMiddleware(412, '회원정보가 일치하지 않습니다.');
          throw errorMiddleware;
        } else {

          const token = jwt.sign(
            {
              userId: user.userId,
              email: user.email,
              nickname: user.nickname,
              provider: 'local',
            },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
          );

          return token
        }
      } else {
        const errorMiddleware = new ErrorMiddleware(412, '회원정보가 일치하지 않습니다.');
        throw errorMiddleware;
      }

    } catch (err) {
      throw err
    };
  };

  kakaoLogin = async (code) => {
    try {

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

      const { data: kakaoUser } = await axios('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`,
        },
      });

      let userExist = await this.loginRepository.findKakaoUser(kakaoUser.id);

      if (!userExist) {
        let user = await this.SignupRepository.registerKakaoUser({
          snsId: kakaoUser.id,
          nickname: kakaoUser.properties.nickname,
          email: kakaoUser.kakao_account.email,
          provider: 'kakao',
        })
        const accessToken = await generateToken(user);
        return {
          result: true,
          token: accessToken,
        };
      } else {
        const accessToken = await generateToken(user);
        return {
          result: true,
          token: accessToken,
        };
      }

    } catch (err) {
      console.log('loginService kakaoLogin Error', err)
      throw err
    }
  }
}


module.exports = LoginService