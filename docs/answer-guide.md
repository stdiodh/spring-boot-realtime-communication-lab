# 실시간 통신 정답 가이드

## 정답을 보기 전에 먼저 확인할 것

- `ChatMessage`에 sender와 content가 담기는가
- `WebSocketConfig`에서 endpoint와 topic 설정이 보이는가
- `WebSocketController`가 메시지를 받고 다시 topic으로 보내는가
- 테스트 페이지에서 connect -> send -> receive가 실제로 보이는가

## 1. 메시지 DTO 정답 포인트

- 이번 시퀀스는 최소 메시지 구조만 있으면 충분합니다.
- sender와 content 두 필드만 있어도 실시간 흐름을 이해할 수 있습니다.

예시 형태:

```kotlin
data class ChatMessage(
    val sender: String,
    val content: String
)
```

## 2. 메시지 수신 메서드 정답 포인트

정답 흐름은 아래 순서입니다.

1. `@MessageMapping("/chat.send")`로 클라이언트 전송 경로를 연결합니다.
2. `ChatMessage`를 파라미터로 받습니다.
3. `@SendTo("/topic/chat")`로 다시 보낼 topic을 연결합니다.
4. 받은 메시지를 반환합니다.

예시 핵심:

```kotlin
@MessageMapping("/chat.send")
@SendTo("/topic/chat")
fun send(message: ChatMessage): ChatMessage {
    return message
}
```

## 3. WebSocket 설정 정답 포인트

정답 흐름은 아래 순서입니다.

1. simple broker를 `/topic`으로 엽니다.
2. application destination prefix를 `/app`으로 둡니다.
3. endpoint를 `/ws-chat`으로 엽니다.
4. 테스트 페이지에서 쉽게 연결할 수 있게 SockJS를 붙입니다.

예시 핵심:

```kotlin
override fun configureMessageBroker(registry: MessageBrokerRegistry) {
    registry.enableSimpleBroker("/topic")
    registry.setApplicationDestinationPrefixes("/app")
}

override fun registerStompEndpoints(registry: StompEndpointRegistry) {
    registry.addEndpoint("/ws-chat").setAllowedOriginPatterns("*").withSockJS()
}
```

## 4. 테스트 페이지 연결 흐름

1. 브라우저가 `/ws-chat`에 연결합니다.
2. `/topic/chat`을 구독합니다.
3. 버튼 클릭 시 `/app/chat.send`로 메시지를 보냅니다.
4. 서버가 다시 `/topic/chat`으로 메시지를 보냅니다.
5. 브라우저가 메시지를 받아 로그에 출력합니다.

## 5. 메시지 전송/수신 확인 예시

- sender: `andi`
- content: `실시간 테스트`

이 값을 보낸 뒤 페이지 로그에
`andi: 실시간 테스트`
형태가 바로 보이면 성공입니다.

## 6. 학생이 자주 틀리는 포인트

- endpoint와 topic 경로를 같은 것으로 생각하는 경우
- `@MessageMapping`만 붙이고 `@SendTo`를 빠뜨리는 경우
- 메시지를 DB에 저장하는 흐름까지 한 번에 넣으려는 경우
- HTTP controller와 WebSocket controller 역할을 섞어 생각하는 경우

## 7. 왜 HTTP만으로는 불편한가

HTTP는 보통 요청이 먼저 와야 응답을 줄 수 있습니다.
반면 실시간 기능은 연결을 유지한 상태에서
서버가 다시 메시지를 밀어줄 수 있어야 더 자연스럽습니다.

## 8. 왜 연결 유지가 필요한가

채팅이나 알림처럼 즉시 반응이 필요한 기능에서는
요청을 매번 새로 열기보다 연결을 유지한 채 메시지를 주고받는 편이 흐름이 더 자연스럽습니다.

## 9. answer 기준 완성 형태

`08-answer`에서는 아래 파일이 완성되어 있습니다.

- `src/main/kotlin/com/andi/rest_crud/dto/ChatMessage.kt`
- `src/main/kotlin/com/andi/rest_crud/config/WebSocketConfig.kt`
- `src/main/kotlin/com/andi/rest_crud/controller/WebSocketController.kt`
- `src/main/resources/static/realtime-demo.html`

핵심은 실시간 통신 전체를 깊게 넣는 것이 아니라,
메시지를 받고 다시 뿌리는 가장 단순한 흐름을 한 번 손으로 경험하는 것입니다.
