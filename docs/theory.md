# Realtime Communication 이론 정리

## 1. 새 메시지를 보려고 계속 새로고침해야 할까?

HTTP 요청/응답만 사용하면 클라이언트가 새 메시지를 보려 할 때마다 서버에 다시 요청해야 합니다.
채팅이나 알림처럼 새 데이터가 자주 생기는 화면에서는 이 방식이 어색해집니다.

이번 시퀀스는 연결을 유지한 상태에서 메시지를 보내고 받는 WebSocket/STOMP 흐름을 다룹니다.

## 2. 배경: HTTP와 WebSocket은 연결 방식이 다릅니다

HTTP는 요청을 보내고 응답을 받으면 한 번의 흐름이 끝납니다.
WebSocket은 연결을 열어 둔 뒤 같은 연결에서 메시지를 주고받습니다.

STOMP는 WebSocket 위에서 destination, topic, message body를 더 명확히 다루게 해주는 메시징 규칙입니다.
클라이언트는 topic을 구독하고, 서버는 받은 메시지를 topic으로 다시 보냅니다.

## 3. 선택한 방식

이번 실습의 흐름은 아래와 같습니다.

```text
connect -> subscribe -> send -> server receive -> topic broadcast -> receive
```

`main`의 테스트 페이지는 외부 클라이언트 라이브러리 없이 native WebSocket으로 STOMP frame을 직접 보내 연결, 구독, 발행, 수신을 확인합니다.

## 4. 핵심 코드로 연결하기

아래 경로는 이번 시퀀스의 실제 코드 경로입니다.

- `src/main/kotlin/com/andi/rest_crud/config/WebSocketConfig.kt`: WebSocket endpoint와 STOMP broker prefix를 설정합니다.
- `src/main/kotlin/com/andi/rest_crud/controller/WebSocketController.kt`: 클라이언트가 보낸 메시지를 받고 topic으로 broadcast합니다.
- `src/main/kotlin/com/andi/rest_crud/dto/ChatMessage.kt`: 송수신 메시지 body 모양을 정합니다.
- `src/main/resources/static/realtime-demo.html`: connect, subscribe, send, receive를 확인하는 테스트 화면입니다.
- `src/main/kotlin/com/andi/rest_crud/security/SecurityConfig.kt`: 실습 데모와 `/ws-chat/**`의 공개 접근 범위를 정합니다.

왜 이 코드를 보는지 먼저 정리합니다.
실시간 통신에서 가장 자주 섞이는 문제는 “어디로 보내고, 어디를 구독하고, 어디서 받는가”입니다.

```kotlin
@MessageMapping("/chat.send")
@SendTo("/topic/chat")
fun send(message: ChatMessage): ChatMessage {
    return message
}
```

이 코드는 클라이언트가 보낸 메시지를 서버가 받아 구독 topic으로 다시 보내는 문제를 해결합니다.
클라이언트는 `/ws-chat`에 연결하고, `/app/chat.send`로 보내며, 구독자는 `/topic/chat`으로 전달된 메시지를 받습니다.

## 5. 실행/테스트 결과로 확인할 것

```bash
docker compose up -d
./gradlew test
./gradlew bootRun
```

브라우저에서 `http://localhost:8080/realtime-demo.html`을 열고 connect, subscribe, send, receive 순서를 확인합니다.
다른 Origin에서 접속할 때는 `APP_WEBSOCKET_ALLOWED_ORIGIN_PATTERNS`에 실제 프런트 주소를 지정합니다.

## 6. 한계와 다음 개선 방향

이번 실습은 연결과 broadcast의 기본 흐름을 다룹니다.
현재 `permitAll` 범위는 실습용입니다. 인증된 WebSocket 연결, 메시지 저장, 재전송, 대규모 broker 운영은 별도 개선 주제로 남깁니다.
다음 시퀀스에서는 애플리케이션을 Docker와 운영 설정으로 실행 가능한 단위로 묶습니다.
