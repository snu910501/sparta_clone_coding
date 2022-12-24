const User = require('../models/user');

class SignupRepository {
  checkEmail = async (email) => {
    try {
      let emailExist = await User.findOne({
        where: {
          email: email
        }
      });
      console.log(emailExist);
      return emailExist;
    } catch (err) {
      throw err
    }
  };

  registerUser = async (email, nickname, hashedPassword) => {
    try {
      let user = await User.create({
        email: email,
        nickname: nickname,
        password: hashedPassword
      })

      return user;
    } catch (err) {
      console.log('signupRepository-registerUser 에러', err)
      throw err;
    }
  }

  registerKakaoUser = async (email, id, nickname) => {
    try {
      let user = await User.create({
        email: email,
        nickname: nickname,
        userId: id,
        provider: 'kakao',
      })

      return user;
    } catch (err) {
      console.log('signupRepository-registerKakaoUser 에러', err)
      throw err;
    }
  }
}

module.exports = SignupRepository