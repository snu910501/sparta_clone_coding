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
}

module.exports = LoginRepository