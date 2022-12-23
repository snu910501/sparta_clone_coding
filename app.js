const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require("cors");

const { sequelize } = require("./models");
const indexRouter = require("./routes");

const app = express();

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('DB 연결 되었습니다.');
  })
  .catch((err) => {
    console.log(err);
  });

const corsOption = {
  origin: ["http://localhost:3000", "*"],
  credentials: true,
};

app.use(cors(corsOption));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/', async (req, res) => {
  res.send('hi');
});

app.listen(80, () => {
  console.log(3000, '번 포트에서 대기중');
});
