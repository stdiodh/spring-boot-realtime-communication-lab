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

콘솔에 `Tomcat started on port 8080`이 표시된 뒤 브라우저 주소창에 다음 URL을 직접 입력합니다.

```text
http://localhost:8080/realtime-demo.html
```

Client A와 B를 연결·구독하고 A의 메시지를 두 client가 받는지 확인합니다. GitHub에서는 [Live Lab 소스](../src/main/resources/static/realtime-demo.html)만 볼 수 있으며, 실제 실험에는 실행 중인 Spring Boot 서버가 필요합니다. Docker나 별도 프론트엔드 서버는 필요하지 않습니다.
