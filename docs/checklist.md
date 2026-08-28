# 체크리스트

## 학생 TODO

- [ ] TODO 1: `WebSocketConfig.registerStompEndpoints(...)`에 native `/ws-chat` endpoint를 등록했습니다.
- [ ] TODO 2: `WebSocketConfig.configureMessageBroker(...)`에 `/app`, `/topic` prefix를 설정했습니다.
- [ ] TODO 3: `WebSocketController`에 `/chat.send` handler와 `/topic/chat` broadcast를 완성했습니다.
- [ ] DTO, 메시지 저장, 채팅방, 인증으로 실습 범위를 넓히지 않았습니다.

## 테스트

- [ ] macOS/Linux에서 `./gradlew test`, Windows에서 `gradlew.bat test`를 실행했습니다.
- [ ] 테스트가 H2와 임의 포트를 사용하므로 Docker 없이 실행된다는 점을 확인했습니다.
- [ ] controller 반환 테스트와 두 native WebSocket session의 broadcast 테스트가 통과합니다.

## Live Lab

- [ ] `http://localhost:8080/realtime-demo.html`을 로그인 없이 열 수 있습니다.
- [ ] Live Lab이 SockJS나 CDN 없이 브라우저 native WebSocket으로 연결됩니다.
- [ ] Subscribe 표시는 `SUBSCRIBE` frame 전송 상태이며 simple broker의 `RECEIPT`가 아님을 설명할 수 있습니다.
- [ ] 탭 A와 B의 실제 `MESSAGE` 수신으로 `/topic/chat` 등록을 확인합니다.
- [ ] 탭 A가 `/app/chat.send`로 보낸 메시지를 두 탭이 받습니다.
- [ ] 탭 B 연결을 끊으면 연결된 구독자만 다음 메시지를 받습니다.

## 환경

- [ ] simple broker가 Redis가 아니라 Spring 애플리케이션 안에서 동작함을 설명할 수 있습니다.
- [ ] 전체 앱 `bootRun`에는 상속된 JPA context 때문에 MySQL이 필요함을 확인했습니다.
- [ ] 07의 `aandi-mysql`이 이미 실행 중이면 재사용했습니다.
- [ ] `aandi-mysql`, `aandi-redis`, `3306`, `6379`, `8080` 충돌 여부를 루트 `README.md`의 명령으로 확인했습니다.

## 설명

- [ ] `/ws-chat`, `/app/chat.send`, `/topic/chat`을 연결, 전송, 구독으로 구분할 수 있습니다.
- [ ] HTTP 응답과 topic broadcast의 수신 대상 차이를 설명할 수 있습니다.
- [ ] 메시지를 저장하지 않아도 이번 broadcast 목표를 확인할 수 있는 이유를 설명할 수 있습니다.
