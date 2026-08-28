# 체크리스트

## 완성 구현

- [ ] `WebSocketConfig`가 native `/ws-chat` endpoint를 등록합니다.
- [ ] application prefix `/app`과 simple broker prefix `/topic`이 설정되어 있습니다.
- [ ] `WebSocketController`가 `/chat.send`에서 받고 `/topic/chat`으로 broadcast합니다.
- [ ] `ChatMessage`는 `sender`, `content`만 가지며 메시지를 DB에 저장하지 않습니다.

## 테스트

- [ ] macOS/Linux에서 `./gradlew test`, Windows에서 `gradlew.bat test`를 실행했습니다.
- [ ] 테스트가 H2와 임의 포트를 사용하므로 Docker 없이 통과합니다.
- [ ] controller 반환 테스트가 통과합니다.
- [ ] 두 native WebSocket/STOMP session의 topic broadcast 테스트가 통과합니다.
- [ ] 정적 Live Lab HTML의 A/B client와 destination 계약 테스트가 통과합니다.

## 브라우저 A/B

- [ ] `http://localhost:8080/realtime-demo.html`을 로그인 없이 열 수 있습니다.
- [ ] SockJS나 CDN 없이 native WebSocket으로 `/ws-chat`에 연결됩니다.
- [ ] Subscribe 표시는 `SUBSCRIBE` frame 전송 상태이며 simple broker의 `RECEIPT`가 아님을 설명할 수 있습니다.
- [ ] 탭 A와 B의 실제 `MESSAGE` 수신으로 `/topic/chat` 등록을 확인합니다.
- [ ] 탭 A가 `/app/chat.send`로 보낸 메시지를 두 탭이 받습니다.
- [ ] 탭 B 연결을 끊은 뒤에는 연결된 구독자만 다음 메시지를 받습니다.

## 환경

- [ ] simple broker가 Redis가 아니라 Spring 애플리케이션 안에서 동작함을 설명할 수 있습니다.
- [ ] 테스트에는 Docker가 필요 없고 전체 앱 `bootRun`에는 JPA context 때문에 MySQL이 필요함을 구분합니다.
- [ ] 07의 `aandi-mysql`이 실행 중이면 재사용했습니다.
- [ ] `aandi-mysql`, `aandi-redis`, `3306`, `6379`, `8080` 충돌 여부를 루트 `README.md`의 명령으로 확인했습니다.

## answer 역할

- [ ] starter와 비교할 때 endpoint, 두 prefix, handler/broadcast의 세 TODO만 확인했습니다.
- [ ] 메시지 저장, 채팅방, 읽음 처리, JWT 인증을 answer 범위로 확장하지 않았습니다.
