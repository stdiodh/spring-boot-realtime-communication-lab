# 이론 정리

## HTTP, WebSocket, STOMP

HTTP는 요청마다 서버가 응답합니다. WebSocket은 한 번 연결한 뒤 클라이언트와 서버가 같은 연결로 메시지를 계속 주고받습니다. STOMP는 WebSocket 통로 위에서 연결, 목적지, 구독, 메시지 형식을 정하는 규칙입니다.

## 이번 실습의 세 경로

| 구분 | 값 | 확인할 코드 |
|---|---|---|
| 연결 endpoint | `/ws-chat` | `WebSocketConfig.registerStompEndpoints(...)` |
| application prefix | `/app` | `WebSocketConfig.configureMessageBroker(...)` |
| handler mapping | `/chat.send` | `WebSocketController`의 `@MessageMapping` |
| 실제 전송 destination | `/app/chat.send` | Live Lab의 `SEND` frame |
| broker prefix | `/topic` | `WebSocketConfig.configureMessageBroker(...)` |
| 구독 topic | `/topic/chat` | Live Lab의 `SUBSCRIBE`, handler의 `@SendTo` |

`/app`은 서버 handler로 들어가는 경로이고 `/topic`은 구독자가 받는 경로입니다.

## 메시지 흐름

```text
CONNECT /ws-chat
-> SUBSCRIBE /topic/chat
-> SEND /app/chat.send
-> @MessageMapping("/chat.send")
-> @SendTo("/topic/chat")
-> RECEIVE
-> DISCONNECT
```

메시지는 `sender`와 `content`만 가지며 DB에 저장하지 않습니다. `enableSimpleBroker("/topic")`은 Spring 애플리케이션 프로세스 안에서 동작하므로 MySQL, Redis, Docker가 필요하지 않습니다.

Spring simple broker는 `SUBSCRIBE` frame에 STOMP `RECEIPT`를 보내지 않습니다. Live Lab의 구독 표시는 frame을 보냈다는 뜻이며, 실제 `MESSAGE` 수신으로 구독 동작을 확인합니다.

## Swagger와 Live Lab

`/swagger`는 세 STOMP 경로와 `ChatMessage(sender, content)` 구조를 읽는 명세 화면입니다. STOMP destination은 HTTP API가 아니므로 Try it out은 비활성화합니다. 실제 CONNECT, SUBSCRIBE, SEND, RECEIVE는 `/realtime-demo.html`에서 실험합니다.

## 실습 범위

포함:

- native WebSocket 연결
- STOMP `CONNECT`, `SUBSCRIBE`, `SEND`, `MESSAGE`, `DISCONNECT`
- 한 topic을 구독한 두 client의 broadcast

포함하지 않음:

- DB 저장, 채팅방, 개인 메시지, 읽음 처리
- 인증과 권한
- Redis 또는 외부 message broker
- 운영용 재연결과 scale-out
