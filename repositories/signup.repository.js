const User = require('../models/user');

class SignupRepository {
  checkEmail = async (email) => {
    try {
      let emailExist = await User.findOne({
        where: {
          email: email
        }
      });
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

  registerKakaoUser = async (snsId, nickname, email) => {
    try {
      console.log('zzdfz', snsId, nickname, email)
      let user = await User.create({
        email: email,
        nickname: nickname,
        snsId: snsId,
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