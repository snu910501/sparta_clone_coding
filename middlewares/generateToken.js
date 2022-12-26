import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        snsId: user.snsId,
        email: user.email,
        nickname: user.nickname,
      },
      process.env.SECRET,
      {
        expiresIn: '1d', //유효기간
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

export { generateToken };