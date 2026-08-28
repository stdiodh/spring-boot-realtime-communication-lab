# 이론 정리

## 1. HTTP와 WebSocket

HTTP는 클라이언트 요청마다 서버가 응답하는 방식입니다. WebSocket은 한 번 연결한 뒤 양쪽이 같은 연결로 여러 메시지를 주고받습니다. 이번 실습에서는 서버가 연결된 모든 topic 구독자에게 메시지를 다시 보내는 차이를 확인합니다.

WebSocket은 전송 통로이고 STOMP는 그 통로에서 목적지, 구독, 메시지 형식을 정하는 규칙입니다. 두 개념을 같은 것으로 보지 않습니다.

## 2. 세 경로의 역할

| 구분 | 값 | 코드에서 확인할 곳 |
|---|---|---|
| 연결 endpoint | `/ws-chat` | `WebSocketConfig.registerStompEndpoints(...)` |
| application prefix | `/app` | `WebSocketConfig.configureMessageBroker(...)` |
| controller mapping | `/chat.send` | `WebSocketController`의 `@MessageMapping` |
| 실제 전송 destination | `/app/chat.send` | Live Lab의 STOMP `SEND` frame |
| simple broker prefix | `/topic` | `WebSocketConfig.configureMessageBroker(...)` |
| 구독 topic | `/topic/chat` | Live Lab의 `SUBSCRIBE`, controller의 `@SendTo` |

`/app`은 서버 handler로 보내는 경로이고 `/topic`은 구독자가 받는 경로입니다. `/app/chat.send`로 보낸 메시지는 application prefix를 제외한 `/chat.send` mapping에 도착합니다.

## 3. 실제 메시지 흐름

1. 브라우저가 `ws://localhost:8080/ws-chat`에 native WebSocket으로 연결합니다.
2. Live Lab이 STOMP `CONNECT` frame을 보내고 서버의 `CONNECTED` frame을 기다립니다.
3. 탭 A와 탭 B가 각각 `/topic/chat`을 `SUBSCRIBE`합니다.
4. 탭 A가 JSON `ChatMessage`를 `/app/chat.send`로 `SEND`합니다.
5. `WebSocketController`가 메시지를 받고 `/topic/chat`으로 보냅니다.
6. simple broker가 구독 중인 두 탭에 STOMP `MESSAGE` frame을 전달합니다.

`ChatMessage`는 `sender`와 `content`만 가집니다. 서버는 메시지를 DB에 저장하지 않고 그대로 broadcast합니다.

Spring simple broker는 `SUBSCRIBE`에 대한 STOMP `RECEIPT`를 보내지 않습니다. Live Lab의 구독 상태는 frame 전송 상태이며, 실제 등록은 브라우저의 `MESSAGE` 수신 또는 자동화 테스트의 `SessionSubscribeEvent`로 확인합니다.

## 4. Live Lab이 native WebSocket을 쓰는 이유

`src/main/resources/static/realtime-demo.html`은 Spring Boot 정적 리소스입니다. 브라우저 기본 `WebSocket` API와 작은 STOMP frame 처리 코드만 사용합니다.

- SockJS fallback을 사용하지 않습니다.
- STOMP JavaScript 라이브러리나 CDN을 사용하지 않습니다.
- 외부 네트워크 없이 로컬 애플리케이션만으로 실험할 수 있습니다.
- 페이지와 `/ws-chat`은 실습용 공개 경로라 회원가입, 로그인, JWT가 필요하지 않습니다.

운영 환경의 인증, 재연결, heartbeat, scale-out을 해결한 클라이언트라는 뜻은 아닙니다. 이번 Live Lab은 연결, 구독, 전송, broadcast를 관찰하는 수업 도구입니다.

## 5. simple broker와 인프라

| 작업 | MySQL | Redis | Docker |
|---|---:|---:|---:|
| `./gradlew test` | 불필요(H2 사용) | 불필요 | 불필요 |
| WebSocket/STOMP simple broker 자체 | 불필요 | 불필요 | 불필요 |
| 현재 전체 앱 `./gradlew bootRun` | 필요(JPA context) | broker로는 불필요 | MySQL을 컨테이너로 띄울 때 필요 |

`enableSimpleBroker("/topic")`의 broker는 Spring 애플리케이션 프로세스 안에 있습니다. `compose.yaml`의 Redis는 이전 캐시 시퀀스에서 상속된 서비스이며 STOMP broker가 아닙니다.

## 6. 이번 범위

포함:

- native WebSocket 연결
- STOMP `CONNECT`, `SUBSCRIBE`, `SEND`, `MESSAGE` 흐름
- 한 topic을 구독한 두 브라우저의 broadcast

포함하지 않음:

- 메시지 DB 저장, 채팅방, 읽음 처리
- JWT 기반 WebSocket 인증
- 외부 broker와 다중 서버 scale-out
- 운영용 재연결과 heartbeat 정책
