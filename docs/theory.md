# 이론 정리

## HTTP, WebSocket, STOMP

HTTP는 요청마다 응답이 끝납니다. WebSocket은 한 번 연결한 뒤 같은 연결로 양방향 메시지를 주고받습니다. STOMP는 WebSocket 위에서 연결, 구독, 전송, 목적지를 표현하는 frame 규칙입니다.

```text
CONNECT
→ SUBSCRIBE /topic/chat
→ SEND /app/chat.send
→ @MessageMapping("/chat.send")
→ @SendTo("/topic/chat")
→ MESSAGE
→ DISCONNECT
```

## 목적지 역할

| 구분 | 값 | 역할 |
|---|---|---|
| WebSocket endpoint | `/ws-chat` | WebSocket 연결 시작점 |
| application prefix | `/app` | 서버 handler로 들어가는 메시지 |
| application destination | `/app/chat.send` | `WebSocketController.send(...)` 호출 |
| broker prefix | `/topic` | 구독자에게 나가는 메시지 |
| topic destination | `/topic/chat` | broadcast 수신 경로 |

`enableSimpleBroker("/topic")`은 Spring 애플리케이션 내부에서 동작합니다. 이 실습에는 MySQL, Redis, 외부 message broker, Docker가 필요하지 않습니다.

## Swagger와 Live Lab

`/swagger`는 `/ws-chat`, `/app/chat.send`, `/topic/chat`과 `ChatMessage(sender, content)`를 읽기 전용으로 설명합니다. STOMP destination은 HTTP API가 아니므로 Try it out으로 실행하지 않으며, 실제 흐름은 `/realtime-demo.html`에서 확인합니다.

## 수업 범위

포함하는 것은 두 client의 연결, 동일 topic 구독, broadcast 수신, 구독 해제와 연결 종료입니다. 메시지 저장, 채팅방, 개인 메시지, 인증, scale-out은 다루지 않습니다.
