const dayjs = require("dayjs");

module.exports = dateCalculator = (createdAt) => {
  const now = dayjs(new Date());
  const created = dayjs(createdAt);

  const year = now.diff(created, "year");
  const month = now.diff(created, "month");
  const day = now.diff(created, "day");
  const hour = now.diff(created, "hour");
  const minute = now.diff(created, "minute");
  const second = now.diff(created, "second");

  if (year > 0) {
    return `${year}년 전`;
  } else if (month > 0) {
    return `${month}달 전`;
  } else if (day > 0) {
    return `${day}일 전`;
  } else if (hour > 0) {
    return `${hour}시간 전`;
  } else if (minute > 0) {
    return `${minute}분 전`;
  } else if (second > 0) {
    return `${second}초 전`;
  }
};
