const ErrorMiddleware = require("../middlewares/errorMiddleware");

exports.signupValidate = (email, password, passwordConfirm) => {
  console.log(email, password, passwordConfirm);
  let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  if (email.match(regExp) != null) {
  } else {
    const errorMiddleware = new ErrorMiddleware(405, '올바르지 않은 형식입니다.');
    throw errorMiddleware;
  }

  if (password !== passwordConfirm) {
    const errorMiddleware = new ErrorMiddleware(405, '올바르지 않은 형식입니다.');
    throw errorMiddleware;
  } else {
    return true;
  }
}