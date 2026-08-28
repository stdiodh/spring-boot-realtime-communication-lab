# 구현 가이드

이번 starter에서 학생이 완성할 것은 정확히 3개 TODO입니다. `ChatMessage.kt`와 `realtime-demo.html`은 읽고 사용하는 제공 코드이며 수정 대상이 아닙니다.

## 시작 전에 경로 그리기

```text
native WebSocket /ws-chat
  -> STOMP SUBSCRIBE /topic/chat
  -> STOMP SEND /app/chat.send
  -> WebSocketController
  -> /topic/chat broadcast
```

## [1/3] TODO: endpoint 등록

파일: `src/main/kotlin/com/andi/rest_crud/config/WebSocketConfig.kt`

`registerStompEndpoints(...)`에서 브라우저가 연결할 `/ws-chat` endpoint를 등록합니다. 제공된 `allowedOriginPatterns`를 endpoint에 적용합니다.

완료 조건:

- `/ws-chat`이 native WebSocket endpoint로 등록됩니다.
- `.withSockJS()`를 추가하지 않습니다.
- 같은 Origin의 Spring 정적 Live Lab이 연결할 수 있습니다.

## [2/3] TODO: application/broker prefix 설정

파일: `src/main/kotlin/com/andi/rest_crud/config/WebSocketConfig.kt`

`configureMessageBroker(...)`에서 두 prefix를 설정합니다.

- application prefix `/app`: controller handler로 들어오는 메시지
- simple broker prefix `/topic`: 구독자에게 나가는 메시지

완료 조건:

- Live Lab의 `/app/chat.send`가 `/chat.send` handler로 연결됩니다.
- Live Lab이 `/topic/chat`을 구독할 수 있습니다.
- Redis를 STOMP broker로 연결하지 않습니다.

## [3/3] TODO: handler와 broadcast 완성

파일: `src/main/kotlin/com/andi/rest_crud/controller/WebSocketController.kt`

`ChatMessage`를 `/chat.send`에서 받고, 받은 객체를 `/topic/chat` 구독자에게 그대로 보내는 최소 handler를 완성합니다.

완료 조건:

- `@MessageMapping`이 `/chat.send`를 가리킵니다.
- `@SendTo`가 `/topic/chat`을 가리킵니다.
- handler가 받은 `ChatMessage`를 그대로 반환합니다.
- DB 저장, 채팅방 분기, 인증 로직을 추가하지 않습니다.

## 자동화 테스트

macOS/Linux:

```bash
./gradlew test
```

Windows CMD:

```bat
gradlew.bat test
```

Windows PowerShell:

```powershell
.\gradlew.bat test
```

테스트는 H2와 임의 포트를 사용하므로 Docker가 필요하지 않습니다.

- `WebSocketControllerTest`: TODO 3의 반환 흐름을 확인합니다.
- `RealtimeWebSocketIntegrationTest`: `SessionSubscribeEvent`로 두 session의 topic 등록을 기다린 뒤 같은 메시지를 받는지 확인합니다.
- `RealtimeDemoAccessIntegrationTest`: 정적 Live Lab HTML의 A/B client, destination, native WebSocket 계약을 확인합니다.

실패 위치를 좁힐 때는 controller 단위 테스트, endpoint 연결, subscribe/send 경로 순서로 확인합니다.

## 브라우저 검증

1. MySQL을 준비하고 애플리케이션을 실행합니다. 실행과 충돌 복구 명령은 루트 `README.md`를 따릅니다.
2. `http://localhost:8080/realtime-demo.html`을 탭 A와 탭 B에서 엽니다.
3. 두 탭에서 Connect를 눌러 `CONNECTED`와 `/topic/chat`의 `SUBSCRIBE` frame 전송 상태를 확인합니다.
4. 탭 A에서 메시지를 보냅니다.
5. 두 탭 모두 같은 `MESSAGE`를 받는지 확인합니다.
6. 탭 B를 Disconnect한 뒤 다시 보내고 연결된 탭만 받는지 확인합니다.

Live Lab은 브라우저 기본 WebSocket으로 STOMP frame을 직접 처리합니다. SockJS, CDN, 회원가입, 로그인, JWT는 필요하지 않습니다.

Spring simple broker는 `SUBSCRIBE`에 대한 STOMP `RECEIPT`를 지원하지 않습니다. 따라서 Live Lab의 Subscribe 표시는 전송 상태이고, 실제 `MESSAGE` 수신이 브라우저에서 확인할 수 있는 등록 증거입니다.

## 마지막 확인

- [ ] TODO는 3개만 구현했습니다.
- [ ] `/ws-chat`, `/app/chat.send`, `/topic/chat`의 역할을 설명할 수 있습니다.
- [ ] 전체 테스트가 통과합니다.
- [ ] 탭 A/B broadcast를 직접 확인했습니다.
