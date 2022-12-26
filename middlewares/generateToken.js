import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (member) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        id: member.id,
        user_id: member.user_id,
        nickname: member.nickname,
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