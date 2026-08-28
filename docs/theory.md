# 이론 정리

## 1. HTTP, WebSocket, STOMP

HTTP는 클라이언트 요청마다 서버가 응답합니다. WebSocket은 한 번 연결한 뒤 양쪽이 같은 연결로 여러 메시지를 주고받습니다. STOMP는 WebSocket 위에서 목적지와 구독, 메시지 frame을 정하는 규칙입니다.

이 answer는 서버가 받은 메시지를 연결된 topic 구독자에게 다시 보내는 최소 broadcast를 완성합니다.

## 2. 완성 구현의 경로

| 구분 | 값 | 연결되는 코드 |
|---|---|---|
| native WebSocket endpoint | `/ws-chat` | `WebSocketConfig.registerStompEndpoints(...)` |
| application prefix | `/app` | `setApplicationDestinationPrefixes(...)` |
| controller mapping | `/chat.send` | `@MessageMapping("/chat.send")` |
| 실제 전송 destination | `/app/chat.send` | Live Lab의 STOMP `SEND` frame |
| simple broker prefix | `/topic` | `enableSimpleBroker("/topic")` |
| 구독 topic | `/topic/chat` | Live Lab의 `SUBSCRIBE`, `@SendTo("/topic/chat")` |

`/app`은 서버 handler로 들어오는 메시지에 붙고 `/topic`은 구독자에게 나가는 메시지에 붙습니다. 두 경로를 바꾸어 쓰면 controller에 도착하지 않거나 구독자가 받지 못합니다.

## 3. connect에서 broadcast까지

1. 탭 A와 B가 각각 `ws://localhost:8080/ws-chat`에 native WebSocket으로 연결합니다.
2. 두 탭이 STOMP `CONNECT`를 보내고 `CONNECTED`를 받습니다.
3. 두 탭이 `/topic/chat`을 `SUBSCRIBE`합니다.
4. 탭 A가 `{ "sender": "A", "content": "hello" }`를 `/app/chat.send`로 `SEND`합니다.
5. `WebSocketController.send(...)`가 `ChatMessage`를 받고 그대로 반환합니다.
6. `@SendTo("/topic/chat")`과 simple broker가 두 구독자에게 `MESSAGE`를 보냅니다.

HTTP의 한 응답과 달리 topic broadcast는 메시지를 보낸 탭뿐 아니라 같은 topic을 구독한 다른 탭에도 전달됩니다.

Spring simple broker는 `SUBSCRIBE`에 대한 STOMP `RECEIPT`를 보내지 않습니다. Live Lab의 구독 상태는 frame 전송 상태이며, 실제 등록은 브라우저의 `MESSAGE` 수신 또는 자동화 테스트의 `SessionSubscribeEvent`로 확인합니다.

## 4. Spring 정적 Live Lab

`src/main/resources/static/realtime-demo.html`은 Spring Boot가 정적 리소스로 제공합니다.

- 브라우저 기본 `WebSocket` API를 사용합니다.
- STOMP `CONNECT`, `SUBSCRIBE`, `SEND`, `MESSAGE` frame을 직접 처리합니다.
- SockJS와 외부 STOMP JavaScript 라이브러리를 사용하지 않습니다.
- CDN이나 외부 네트워크가 필요하지 않습니다.
- 실습용 공개 경로라 회원가입, 로그인, JWT가 필요하지 않습니다.

이 페이지는 프로토콜 흐름을 보이기 위한 수업 도구입니다. 운영용 재연결, heartbeat, 인증 클라이언트를 대신하지 않습니다.

## 5. simple broker와 Redis

`enableSimpleBroker("/topic")`은 Spring 애플리케이션 내부 broker를 켭니다. `compose.yaml`의 Redis는 이전 캐시 시퀀스에서 상속된 서비스이며 이번 STOMP broker가 아닙니다.

| 작업 | MySQL | Redis | Docker |
|---|---:|---:|---:|
| `./gradlew test` | 불필요(H2 사용) | 불필요 | 불필요 |
| WebSocket/STOMP simple broker 자체 | 불필요 | 불필요 | 불필요 |
| 현재 전체 앱 `./gradlew bootRun` | 필요(JPA context) | broker로는 불필요 | MySQL을 컨테이너로 띄울 때 필요 |

## 6. answer 범위

포함:

- `/ws-chat` native WebSocket endpoint
- `/app`과 `/topic`의 STOMP routing
- `ChatMessage` handler와 두 구독자 broadcast
- 자동화 테스트와 브라우저 A/B 검증

포함하지 않음:

- 메시지 저장, 채팅방, 읽음 처리
- JWT 기반 WebSocket 인증
- Redis 또는 외부 message broker 연동
- 다중 서버 scale-out과 운영용 재연결 정책
