require("./db");

const { appServer } = require("./server");
const { RtcExchangerController } = require("./controllers/rtc-exchanger");
const {
  RtcExchangerService,
  SocketStreamMapper,
  SocketUserMapper,
} = require("./services/rtc-exchanger");

new RtcExchangerController(
  appServer,
  new RtcExchangerService(new SocketStreamMapper(), new SocketUserMapper())
);
