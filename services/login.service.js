const jwt = require('jsonwebtoken');
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

  kakaoLogin = async (email, id, nickname) => {
    try {
      let userExist = await this.LoginService.login(email)
      if (userExist) {
        const token = jwt.sign(
          {
            userId: user.userId,
            email: user.email,
            nickname: user.nickname,
          },
          process.env.SECRET_KEY,
          { expiresIn: '1h' }
        );

        return token
      } else {
        const user = await this.signupRepository.registerKakaoUser(email, id, nickname)
        return user;
      }
    } catch (err) {
      console.log('loginService kakaoLogin Error', err)
      throw err

    }
  }
}


module.exports = LoginService