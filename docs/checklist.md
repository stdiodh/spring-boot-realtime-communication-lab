# 체크리스트

## 코드

- [ ] `WebSocketConfig`가 `/ws-chat` endpoint를 등록합니다.
- [ ] application prefix `/app`과 broker prefix `/topic`을 설정합니다.
- [ ] `WebSocketController`가 `/chat.send`에서 받고 `/topic/chat`으로 broadcast합니다.
- [ ] `ChatMessage`는 `sender`, `content`만 가집니다.

## 자동 테스트

- [ ] `./gradlew clean test`가 Docker 없이 통과합니다.
- [ ] context와 controller 테스트가 통과합니다.
- [ ] 두 native WebSocket/STOMP session이 같은 메시지를 받습니다.
- [ ] Live Lab의 두 client와 세 destination 계약을 확인합니다.

## 브라우저

- [ ] `/realtime-demo.html`을 별도 프론트엔드 서버 없이 엽니다.
- [ ] Client A와 B를 Connect하고 `/topic/chat`을 Subscribe합니다.
- [ ] A가 `/app/chat.send`로 보낸 메시지를 A와 B가 받습니다.
- [ ] B를 Unsubscribe한 뒤에는 A만 다음 메시지를 받습니다.
- [ ] Disconnect 후 Send가 비활성화됩니다.

## 범위

- [ ] MySQL, Redis, Docker가 필요하지 않음을 확인합니다.
- [ ] 메시지 저장, 채팅방, 인증을 실습 범위에 추가하지 않습니다.
