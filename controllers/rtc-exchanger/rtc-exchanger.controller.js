const { Server: SocketServer } = require("socket.io");

class RtcExchangerController {
  constructor(appServer, rtcExchangerService) {
    this.rtcExchangerService = rtcExchangerService;

    this.socketServer = new SocketServer(appServer);

    console.debug("The web socket server was started.");

    this.socketServer.on("connection", this.rtcExchangerService.onConnection);
  }
}

module.exports = { RtcExchangerController };
