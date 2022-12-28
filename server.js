const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require('http');

const indexRouter = require("./routes");

const app = express();

app.set("port", process.env.NODE_ENV || "3000");

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

app.use(function (req, res, next) {
  console.log(req.headers);
  next();
})

app.use("/", indexRouter);

const appServer = http.createServer(app);

appServer.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});

module.exports = { app, appServer };
