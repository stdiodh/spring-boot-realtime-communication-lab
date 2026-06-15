# Realtime Communication 구현 안내

## 1. 해결할 문제

새 메시지를 확인하려고 HTTP 조회를 반복하면 실시간 화면을 만들기 어렵습니다.
WebSocket/STOMP를 사용해 연결을 유지하고 topic으로 메시지를 받는 흐름을 만듭니다.

## 2. 구현 흐름

1. `WebSocketConfig.kt`에서 endpoint와 broker prefix를 설정합니다.
2. `ChatMessage.kt`에서 송수신 메시지 body를 정합니다.
3. `WebSocketController.kt`에서 메시지를 받아 topic으로 보냅니다.
4. `realtime-demo.html`에서 connect, subscribe, send, receive를 확인합니다.

위 파일 경로는 `08-implementation`, `08-answer` 브랜치 기준입니다.

## 3. 핵심 코드

왜 이 코드를 보는지 먼저 정리합니다.
클라이언트가 보낸 메시지를 서버가 topic으로 다시 보내야 다른 구독자가 받을 수 있습니다.

```kotlin
@MessageMapping("/chat")
@SendTo("/topic/messages")
fun send(message: ChatMessage): ChatMessage {
    return message
}
```

이 코드는 send와 receive가 한 Controller 흐름으로 이어지는 문제를 해결합니다.
클라이언트는 publish destination으로 메시지를 보내고, topic 구독으로 결과를 받습니다.

## 4. 실행/테스트

```bash
docker compose up -d
./gradlew test
./gradlew bootRun
```

브라우저에서 아래 페이지를 엽니다.

```text
http://localhost:8080/realtime-demo.html
```

## 5. 한계와 다음 개선 방향

이번 실습은 실시간 송수신의 최소 흐름입니다.
인증, 권한, 채팅 저장, 재연결 전략은 다음 개선 주제로 분리합니다.
