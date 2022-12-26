const SignupRepository = require('../repositories/signup.repository');
const ErrorMiddleware = require("../middlewares/errorMiddleware");
const { signupValidate } = require('../middlewares/signupValidate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class SignupService {
  signupRepository = new SignupRepository()

  checkEmail = async (email) => {
    // emailExist변수에 값이 담겨서 온다면 이메일이 중복되었단 의미
    // 변수에 값이 없다면 가입이 가능하므로 true를 리턴
    try {
      let emailExist = await this.signupRepository.checkEmail(email);
      if (emailExist) {
        const errorMiddleware = new ErrorMiddleware(502, '이메일이 존재하는디? ')
        throw errorMiddleware
      } else {
        return true;
      }
    } catch (err) {

      throw err
    }
  };

  registerUser = async (email, nickname, password, passwordConfirm) => {
    try {
      //이메일, 비번 검사하는 단계
      let signupValidateResult = await signupValidate(email, password, passwordConfirm);

      if (signupValidateResult == true) {
        const hashedPassword = await bcrypt.hash(password, 6);
        return await this.signupRepository.registerUser(email, nickname, hashedPassword)
      }

    } catch (err) {
      console.log('signupService-registerUser 에러')
      throw err;
    }
  };

  registerKakaoUser = async (email, nickname, snsId) => {
    try {
      const userExist = await this.signupRepository.checkEmail(email);

      if (userExist) {
        const token = jwt.sign(
          {
            userId: userExist.snsId,
            email: userExist.email,
            nickname: userExist.nickname,
            provider: 'kakao',
          },
          process.env.SECRET_KEY,
          { expiresIn: '1h' }
        );

        return token
      } else {
        let user = await this.signupRepository.registerKakaoUser(email, snsId, nickname);
        return user;
      }
    } catch (err) {
      console.log('signupService-registerKakaoUser 에러', err)
      throw err;
    }
  }
}

module.exports = SignupService