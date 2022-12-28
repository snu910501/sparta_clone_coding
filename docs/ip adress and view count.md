# 조회수 기능 구현

## 개요

쿠키나 게시글을 접속한 IP주소를 기반으로 게시글의 조회수 기능을 구현할 수 있다

1. 쿠키를 활용하는 방법

- 조회수 기능 구현시 처음 시도한 방법이었으나 아래와 같은 문제점으로 기각
  - 쿠키를 삭제해 조회수를 늘리는 등 사용자가 악용할 수 있다
  - 조회한 영상이 많아질 수록 저장시켜야할 쿠키가 무한정 늘어난다
  - 쿠키를 다루는 방법이 익숙하지 않아 프론트와 쿠키를 주고받기 어렵다

2. IP와 조회한 게시글 postId를 DB에 저장시켜 조회수 산정

- 기술 매니저님과의 상담을 통해 쿠키를 활용한 방법보다 안전한 IP 주소 기반 조회수 기능을 구현했다.

  - Nginx 설정을 통해 사용자의 IP 주소를 전달 받음

  ```
  // sudo nano /etc/nginx/sites-available/default를 통해 설정 추가
  // 설정값 중 일부
  proxy_pass http://localhost:3000;
                ...
  			        proxy_set_header  X-Forwarded-For $remote_addr; // 헤더에 방문하는 사람 ip 주소 넘기기
  ```

  - 전달 받은 IP 주소 가공

  ```
  // middlewares/getUserIp.js 코드
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
  ```

  - 특정 IP가 영상을 조회한지 24시간 지나면 조회수를 1 추가할 수 있도록 허용

  ```
  // services/view.service 코드 중 일부
  // DB 저장 시간이 9시간 전이므로 날짜 처리
      const viewed = dayjs(findView.createdAt);
      viewed.add(9, "hour");

      // 조회한지 하루 이상 지났으면 조회수 추가
      if (now.diff(viewed, "day", true) >= 1) {
        await this.viewRepository.addView(address, postId);
        return true;
      } else {
        return true;
      }
  ```

  - 사용자의 IP주소를 사용자의 동이 없이 수집하는 것은 불법이기 때문에 사이트 접속 후 게시글 들어가기 전에 사용자 동의를 구해야함
  - 마찬가지의 이유로 전달받은 IP주소 중 끝 두자리만 DB에 저장시킴
  - IP 기반 조회수 기능은 공공장소와 같은 곳에서 여러 사용자가 동일 영상을 시청할 시 조회수가 한번밖에 늘어나지 않는 단점이 있다
