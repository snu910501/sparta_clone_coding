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
      console.log('zz')
      let user = await User.create({
        email: email,
        nickname: nickname,
        password: hashedPassword
      })
      console.log('user', user)
      return user;
    } catch (err) {
      console.log('signupRepository-registerUser 에러')
      throw err;
    }
  }
}

module.exports = SignupRepository