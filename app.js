require('./db');

const { appServer } = require('./server');
const { RtcExchangerController, SocketStreamMapper, SocketUserMapper } = require('./controllers/rtc-exchanger');

new RtcExchangerController(
  appServer,
  new SocketStreamMapper(),
  new SocketUserMapper(),
);
