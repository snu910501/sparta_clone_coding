const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = generateToken = (user) => {
  const token = jwt.sign({
    snsId: user.snsId,
    email: user.email,
    nickname: user.nickname,
  },
    process.env.SECRET,
    {
      expiresIn: '1d', //유효기간
    },)

  return token
};
