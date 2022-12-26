const User = require("../models/user");

class LoginRepository {
  login = async (email) => {
    try {
      let user = await User.findOne({
        where: {
          email: email
        }
      });

      return user;
    } catch (err) {
      console.log('DB Error')
      throw err
    }
  };

  findKakaoUser = async (email) => {
    try {
      let userExist = await User.findOne({
        where: {
          email: email
        }
      })
      console.log('userExistzz', userExist);
      return userExist;
    } catch (err) {
      console.log('LoginRepository findKakaoUser Error');
      throw err
    }
  }
}

module.exports = LoginRepository