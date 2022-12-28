module.exports = getUserIP = (req) => {
  const addr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const arr = addr.split(".");
  const address = arr.slice(arr.length - 2, arr.length).join(".");
  return address;
};
