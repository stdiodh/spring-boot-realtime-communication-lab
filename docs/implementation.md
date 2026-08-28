# 완성 구현 가이드

`08-implementation`의 세 TODO를 다음 순서로 완성한 결과입니다.

## [1/3] STOMP endpoint

파일: `src/main/kotlin/com/andi/realtime/config/WebSocketConfig.kt`

```kotlin
registry.addEndpoint("/ws-chat")
    .setAllowedOriginPatterns(*allowedOrigins())
```

## [2/3] application과 broker prefix

같은 파일의 `configureMessageBroker(...)`에 두 방향을 설정합니다.

```kotlin
registry.setApplicationDestinationPrefixes("/app")
registry.enableSimpleBroker("/topic")
```

## [3/3] handler와 broadcast

파일: `src/main/kotlin/com/andi/realtime/controller/WebSocketController.kt`

```kotlin
@MessageMapping("/chat.send")
@SendTo("/topic/chat")
fun send(message: ChatMessage): ChatMessage = message
```

handler는 메시지를 저장하지 않고 받은 `ChatMessage`를 그대로 topic 구독자에게 전달합니다.

## 검증

```bash
./gradlew clean test
./gradlew bootRun
```

[http://localhost:8080/realtime-demo.html](http://localhost:8080/realtime-demo.html)에서 Client A와 B를 연결·구독하고 A의 메시지를 두 client가 받는지 확인합니다. Docker나 별도 프론트엔드 서버는 필요하지 않습니다.
