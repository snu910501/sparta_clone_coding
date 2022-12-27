# WebRTC Signal Exchanger

## 개요

클라이언트 간의 실시간 미디어 데이터 통신을 위한 프로토콜인 WebRTC 기반의
실시간 영상 스트리밍을 구현하기 위해, WebRTC의 최초 연결 수립에 필요한 Session Descriptor를
교환하기 위한 Signal Exchanger를 Socket.io를 사용하여 웹 소켓 기반으로 구현한 기능입니다.

## 초기화

이 Signal Exchanger는 `app.js` 파일이 실행되면, `RtcExchangerController` 클래스를 객체화 하며 구동됩니다.

`RtcExchangerController` 클래스는 웹 소켓 서버 객체를 생성함과 동시에 기존에 생성한 HTTP 서버 객체에 바인딩 하며, 웹 소켓을 통해 발생하는 각 이벤트별 비즈니스 로직을 구현한 `RtcExchangerService` 클래스의 메소드를 이벤트에 바인딩 하는 역할을 합니다.

> `app.js`

```javascript
const { RtcExchangerController } = require("./controllers/rtc-exchanger");
const {
  RtcExchangerService,
  SocketStreamMapper,
  SocketUserMapper,
} = require("./services/rtc-exchanger");

...

new RtcExchangerController(
  appServer,
  new RtcExchangerService(new SocketStreamMapper(), new SocketUserMapper())
);
```

위 코드에서 생성하는 `RtcExchangerService`는 웹 소켓을 통해 발생하는 각 이벤트에 대한 비즈니스 로직을 구현한 클래스입니다.

이벤트에는 WebRTC의 Session Descriptor 교환을 위한 `offer`, `answer` 이벤트가 포함됩니다.

`RtcExchangerService`의 객체가 소켓 객체를 잘 관리하기 위해서는, 각 소켓 객체의 ID를 이벤트와 함께 전달받은 유저 데이터 및 채널 이름과 맵핑해야 하므로, 맵핑 수행 및 데이터 관리를 하게 되는 `SocketStreamMapper`와 `SocketUserMapper` 클래스를 객체화 하여 `RtcExchangerService` 객체에 주입합니다.

## 클라이언트의 채널(스트림) 참여

유튜브에서 라이브 영상 스트리밍을 진행하는 주체를 `채널(Channel)`로 정의했고, 해당 채널에서 시작하는 라이브 영상 스트리밍 세션을 `스트림(Stream)`으로 정의했습니다.

먼저, 특정 유저 `A`가 특정 채널명을 기준으로 라이브 스트리밍을 시작하면 스트림이 생성되고, 다른 유저 `B`가 동일한 채널명을 기준으로 `A`가 생성한 스트림에 참여합니다.

> `services/rtc-exchanger/rtc-exchanger.service.js`

```javascript
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
```

특정 클라이언트가 스트림을 생성하거나, 이미 생성된 스트림에 참여하기 위해서 채널명과 함께  `joinStream` 이벤트를 발행하면, 소켓 서버는 채널명을 기준으로 해당 소켓 객체를 `Socket.io`의 `Rooms API`를 기반으로 구현한 스트림에 참여시킵니다.

스트림에 참여한 즉시 해당 스트림에 존재하는 모든 유저에게 자신의 유저 객체를 인수로 하여 `userJoinedStream` 이벤트가 발행되며, 해당 이벤트를 구독하여 어떤 유저가 스트림에 참여하였는지 알 수 있습니다.

클라이언트는 스트림에 참여한 즉시 해당 스트림에 존재하는 모든 소켓 객체의 ID를 `allStreamUsers` 이벤트를 통해 전달 받게 되고, 이 소켓 객체 ID를 기준으로 모든 유저와 WebRTC 프로토콜의 Session Descriptor를 교환해야 합니다.

### WebRTC Session Descriptor 교환

> 해당 기능은 [특정 블로그](https://surprisecomputer.tistory.com/9)를 참고하여 개발했습니다.

각 클라이언트는 서로의 Session Descriptor 객체를 교환하기 위해 `offer`, `receiveOffer`, `answer`, `receiveAnswer`, `candidate`, `receiveCandidate` 이벤트를 구독해야 합니다.

> `services/rtc-exchanger/rtc-exchanger.service.js`

```javascript
  onOffer(socket, { channelName, sessionDescriptor }) {
    socket.broadcast.to(channelName).emit("receiveOffer", sessionDescriptor);
  }

  onAnswer(socket, { channelName, sessionDescriptor }) {
    socket.broadcast.to(channelName).emit("receiveAnswer", sessionDescriptor);
  }

  onCandidate(socket, { channelName, candidate }) {
    socket.broadcast.to(channelName).emit("receiveCandidate", candidate);
  }
```

특정 클라이언트 `A`가 자신이 참여한 스트림의 채널명과 WebRTC API를 통해 생성한 Session Descriptor 객체를 인수로 하여 `offer` 이벤트를 발행함과 동시에 `receiveAnswer` 이벤트를 구독합니다.

다른 클라이언트 `B`가 `receiveOffer` 이벤트를 구독하여 `A`의 Session Descriptor 객체를 받으면, 해당 Session Descriptor 객체를 자신의 미디어 객체에 연결하고, `offer`와 같은 과정으로 `B` 자신의 Session Descriptor 객체를 인수로 하여 `answer` 이벤트를 발행합니다.

`A`는 `receiveAnswer` 이벤트를 통해 받은 `B`의 Session Descriptor 객체를 자신의 미디어 객체에 연결함으로써, `A`와 `B` 각 클라이언트가 WebRTC 프로토콜을 통한 연결이 수립됩니다.

## 클라이언트의 스트림 이탈

특정 유저의 웹 소켓 연결이 끊어져 `disconnect` 이벤트가 발행되거나, `leaveStream` 이벤트를 발행한 경우, 해당 유저를 스트림에서 제외합니다.

> `services/rtc-exchanger/rtc-exchanger.service.js`

```javascript
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
```

스트림에서 이탈한 즉시 해당 스트림에 존재하는 모든 유저에게 자신의 유저 객체를 인수로 하여 `userLeftStream` 이벤트가 발행되며, 해당 이벤트를 구독하여 어떤 유저가 스트림에서 이탈하였는지 알 수 있습니다.
