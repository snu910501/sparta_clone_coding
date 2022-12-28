const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const jwt = require('jsonwebtoken');

const { sequelize } = require("./models");
const indexRouter = require("./routes");

const User = require('./models/user')

const app = express();
app.set("port", process.env.NODE_ENV || "3001");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("DB 연결 되었습니다.");
  })
  .catch((err) => {
    console.log(err);
  });

const corsOption = {
  origin: ["http://localhost:3000", "*"],
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOption));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', function (req, res, next) {
  // 새로고침 마다 토큰 검사
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || '').split(' ');
  if (!authToken || authType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 이용 가능한 기능입니다1',
    });
    return;
  }

  const { userId } = jwt.verify(authToken, process.env.SECRET_KEY);

  User.findByPk(userId).then((user) => {
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

    res.status(200).json({
      result: true,
      token: token,
    })
    next();
  }).catch((err) => {
    res.status(401).json({
      result: false,
    })
  })

  return;
})

app.use("/", indexRouter);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
