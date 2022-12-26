class RtcExchangerService {
  constructor(socketStreamMapper, socketUserMapper) {
    this.socketStreamMapper = socketStreamMapper;
    this.socketUserMapper = socketUserMapper;

    //#region Binds `this` scope
    this.onConnection = this.onConnection.bind(this);

    this.onJoinStream = this.onJoinStream.bind(this);
    this.onLeaveStream = this.onLeaveStream.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);

    this.onOffer = this.onOffer.bind(this);
    this.onAnswer = this.onAnswer.bind(this);
    //#endregion
  }

  onConnection(socket) {
    console.debug("The socket connection was estabilished:", socket.id);

    socket.on("disconnect", () => this.onDisconnect(socket));

    //#region Channel Stream Events
    socket.on("joinStream", (params) => this.onJoinStream(socket, params));
    socket.on("leaveStream", (params) => this.onLeaveStream(socket, params));
    //#endregion

    //#region WebRTC Signalling Events
    socket.on("offer", (params) => this.onOffer(socket, params));
    socket.on("answer", (params) => this.onAnswer(socket, params));
    //#endregion
  }

  //#region Channel Stream Event Handlers
  onJoinStream(socket, { channelName, user }) {
    console.debug("The user has joined the channel:", { channelName, user });

    socket.join(channelName);
    socket.broadcast.to(channelName).emit("userJoinedStream", user);

    socket.emit(
      "allStreamUsers",
      this.socketStreamMapper.getAllStreamIds(channelName)
    );

    this.socketStreamMapper.map(socket, channelName);
    this.socketUserMapper.map(socket, user);
  }

  onLeaveStream(socket, { channelName, user }) {
    console.debug("The user has left the channel:", { channelName, user });

    socket.leave(channelName);
    socket.broadcast.to(channelName).emit("userLeftStream", user);

    this.socketStreamMapper.unmap(socket);
    this.socketUserMapper.unmap(socket);
  }

  onDisconnect(socket) {
    const channelName = this.socketStreamMapper.get(socket);
    const user = this.socketUserMapper.get(socket);

    this.onLeaveStream(socket, { channelName, user });
  }
  //#endregion

  //#region WebRTC Signalling Event Handlers
  onOffer(socket, { channelName, sessionDescriptor }) {
    socket.broadcast.to(channelName).emit("receiveOffer", sessionDescriptor);
  }

  onAnswer(socket, { channelName, sessionDescriptor }) {
    socket.broadcast.to(channelName).emit("receiveAnswer", sessionDescriptor);
  }
  //#endregion
}

module.exports = { RtcExchangerService };
