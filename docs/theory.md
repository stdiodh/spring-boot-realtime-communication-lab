# 실시간 통신 이론 정리

요청이 들어와야만 응답하는 HTTP 흐름을 넘어, 연결을 유지한 채 서버가 다시 메시지를 밀어줄 수 있는 감각을 익히는 문서입니다.

이번 주차 한 줄 요약  
WebSocket과 STOMP를 이용해 메시지를 받고 topic으로 다시 뿌리는 가장 단순한 실시간 흐름을 확인하는 단계입니다.

## 먼저 이것만 기억해도 됩니다

- HTTP와 WebSocket은 통신 방식이 다릅니다.
- 실시간 기능에서는 서버가 다시 메시지를 보내는 흐름이 중요합니다.
- 이번 시퀀스의 핵심은 메시지 수신 -> broadcast -> 수신 확인입니다.

## 이 주제를 왜 배우는가

지금까지 만든 기능은 대부분 HTTP 요청이 들어오면 그때 응답하는 구조였습니다.
이 구조는 CRUD나 인증 같은 흐름에는 잘 맞지만,
채팅이나 알림처럼 "서버가 바로 다시 알려줘야 하는 기능"에는 불편할 수 있습니다.

그래서 이번 실습에서는 WebSocket 기반 연결을 아주 작게 붙여서,
"클라이언트가 보낸 메시지를 서버가 다시 topic으로 뿌리고, 연결된 화면이 바로 받는 흐름"을 경험해봅니다.
이 감각이 있어야 다음 운영 환경이나 확장 주제에서도 실시간 요구사항을 더 잘 이해할 수 있습니다.

## 이번 실습 흐름을 먼저 한눈에 보기

1. 브라우저가 WebSocket endpoint에 연결합니다.
2. 클라이언트가 메시지를 `/app/chat.send`로 보냅니다.
3. 서버가 메시지를 받습니다.
4. 서버가 `/topic/chat`으로 다시 메시지를 보냅니다.
5. 구독 중인 클라이언트가 메시지를 바로 화면에 표시합니다.

짧게 말하면 이번 실습은  
연결 -> 메시지 전송 -> 서버 수신 -> topic broadcast -> 실시간 수신 흐름을 익히는 과정입니다.

한 줄로 다시 보기  
요청 한 번으로 끝나는 통신이 아니라, 연결을 유지한 채 서버와 클라이언트가 계속 메시지를 주고받는 첫 실습입니다.

## 오늘 꼭 잡아야 할 질문

- HTTP와 WebSocket은 어떤 점이 다른가요?
- 서버가 다시 메시지를 보낼 수 있는 이유는 무엇인가요?
- 메시지 DTO는 왜 필요한가요?
- 이번 코드에서 실시간 흐름이 가장 잘 보이는 클래스는 무엇인가요?
- 채팅이나 알림에서 왜 이런 구조가 필요한가요?

## 중요한 코드 먼저 보기

### 1. 메시지를 받아 다시 보내는 코드

```kotlin
@MessageMapping("/chat.send")
@SendTo("/topic/chat")
fun send(message: ChatMessage): ChatMessage {
    return message
}
```

- 이 코드는 실시간 흐름의 핵심을 보여줍니다.
- 여기서는 특히 `@MessageMapping`과 `@SendTo`를 먼저 보세요.
- 학생이 기억해야 할 핵심은 "서버가 받은 메시지를 다시 연결된 클라이언트들에게 뿌릴 수 있다"는 점입니다.
- 파일: `src/main/kotlin/com/andi/rest_crud/controller/WebSocketController.kt`

### 2. WebSocket endpoint와 broker를 여는 코드

```kotlin
override fun configureMessageBroker(registry: MessageBrokerRegistry) {
    registry.enableSimpleBroker("/topic")
    registry.setApplicationDestinationPrefixes("/app")
}

override fun registerStompEndpoints(registry: StompEndpointRegistry) {
    registry.addEndpoint("/ws-chat").setAllowedOriginPatterns("*").withSockJS()
}
```

- 이 코드는 어디로 연결하고, 어디로 다시 보낼지를 보여줍니다.
- 학생이 기억해야 할 핵심은 "클라이언트가 보낼 경로와 구독할 경로가 다르다"는 점입니다.
- 파일: `src/main/kotlin/com/andi/rest_crud/config/WebSocketConfig.kt`

### 3. 테스트 페이지에서 실시간 수신을 확인하는 코드

```javascript
stompClient.subscribe("/topic/chat", (frame) => {
  const message = JSON.parse(frame.body);
  appendMessage(`${message.sender}: ${message.content}`);
});
```

- 이 코드는 브라우저가 topic 메시지를 받는 지점을 보여줍니다.
- 학생이 기억해야 할 핵심은 "구독 중이면 서버가 다시 보낸 메시지를 바로 받을 수 있다"는 점입니다.
- 파일: `src/main/resources/static/realtime-demo.html`

## 핵심 용어를 쉬운 말로 정리하기

### HTTP

- 뜻  
  요청이 오면 그때 응답을 돌려주는 가장 익숙한 웹 통신 방식입니다.
- 왜 중요한가  
  지금까지 대부분의 API가 이 방식으로 동작했습니다.
- 이번 코드에서는 어디에 보이는가  
  `PostController`, `AuthController` 같은 REST API에서 볼 수 있습니다.
- 짧은 상황 예시  
  게시글 조회는 요청을 보내야만 서버가 응답합니다.

### WebSocket

- 뜻  
  연결을 유지한 채 클라이언트와 서버가 계속 메시지를 주고받을 수 있는 통신 방식입니다.
- 왜 중요한가  
  실시간 기능에서는 요청-응답 한 번으로 끝나지 않는 흐름이 필요합니다.
- 이번 코드에서는 어디에 보이는가  
  `WebSocketConfig`의 endpoint 설정에서 볼 수 있습니다.
- 짧은 상황 예시  
  채팅창에 메시지를 보내고, 바로 다시 수신하는 흐름이 여기에 가깝습니다.

### 연결 유지

- 뜻  
  요청이 끝나도 연결을 끊지 않고 계속 유지하는 상태입니다.
- 왜 중요한가  
  서버가 나중에 다시 메시지를 보낼 수 있는 기반이 됩니다.
- 이번 코드에서는 어디에 보이는가  
  브라우저가 `/ws-chat`에 연결한 뒤 구독을 유지하는 흐름에서 볼 수 있습니다.
- 짧은 상황 예시  
  한 번 연결한 뒤 여러 메시지를 계속 주고받을 수 있습니다.

### 메시지 DTO

- 뜻  
  실시간으로 주고받는 데이터 구조를 담는 객체입니다.
- 왜 중요한가  
  sender, content 같은 필요한 값만 명확하게 주고받을 수 있습니다.
- 이번 코드에서는 어디에 보이는가  
  `ChatMessage.kt`에서 볼 수 있습니다.
- 짧은 상황 예시  
  누가 어떤 메시지를 보냈는지 한 번에 표현할 수 있습니다.

### topic broadcast

- 뜻  
  특정 topic을 구독 중인 모든 클라이언트에게 같은 메시지를 다시 보내는 흐름입니다.
- 왜 중요한가  
  채팅이나 알림처럼 여러 화면이 동시에 같은 이벤트를 받아야 할 때 유용합니다.
- 이번 코드에서는 어디에 보이는가  
  `@SendTo("/topic/chat")`에서 볼 수 있습니다.
- 짧은 상황 예시  
  한 브라우저가 보낸 메시지를 다른 브라우저도 동시에 받습니다.

### 실시간 통신

- 뜻  
  서버와 클라이언트가 이벤트를 거의 바로 주고받는 통신 흐름입니다.
- 왜 중요한가  
  즉각적인 반응이 중요한 기능에서 사용자 경험 차이가 큽니다.
- 이번 코드에서는 어디에 보이는가  
  `realtime-demo.html`에서 send 후 바로 메시지가 돌아오는 흐름입니다.
- 짧은 상황 예시  
  채팅, 알림, 라이브 상태 표시 같은 기능에서 자주 쓰입니다.

## 이번 실습에서 꼭 보면 좋은 포인트

- REST controller와 WebSocket controller가 역할이 어떻게 다른지
- `/app/chat.send`와 `/topic/chat`이 각각 무엇을 뜻하는지
- 서버가 받은 메시지를 그대로 다시 보내도 실시간 흐름이 성립한다는 점
- 테스트 페이지에서 connect, subscribe, send가 어떤 순서로 일어나는지

## 자주 헷갈리는 포인트

- 이번 시퀀스는 WebSocket 프로토콜 전체를 깊게 배우는 단계가 아닙니다.
- 메시지를 DB에 저장하지 않아도 실시간 흐름은 충분히 볼 수 있습니다.
- topic broadcast는 HTTP 응답과 다르게 연결된 여러 클라이언트가 같이 받을 수 있습니다.
- 채팅방이나 읽음 처리까지 넣지 않아도 실시간 통신의 핵심은 이해할 수 있습니다.

## 직접 말해보기

- HTTP와 WebSocket은 어떤 점이 다른가요?
- 서버가 다시 메시지를 보낼 수 있는 이유는 무엇인가요?
- 메시지 DTO는 왜 필요한가요?
- `/app/chat.send`와 `/topic/chat`은 각각 어떤 역할인가요?

## 복습 체크리스트

- [ ] HTTP와 WebSocket의 차이를 설명할 수 있습니다.
- [ ] 메시지 DTO 역할을 설명할 수 있습니다.
- [ ] 서버가 받은 메시지를 topic으로 다시 보내는 흐름을 말할 수 있습니다.
- [ ] 테스트 페이지에서 메시지를 보내고 다시 받는 과정을 설명할 수 있습니다.
- [ ] 채팅/알림에서 왜 이런 구조가 필요한지 말할 수 있습니다.

## 오늘 꼭 기억할 것

이번 시퀀스의 핵심은 WebSocket 기능을 많이 외우는 것이 아닙니다.
대신 "요청이 와야만 응답하는 구조를 넘어, 연결을 유지한 채 서버가 다시 메시지를 밀어줄 수 있다"는 감각을 잡는 것입니다.

## 다음 실습과 연결하기

다음 시퀀스에서 배포와 운영 환경으로 넘어가면,
이런 실시간 연결이 실제 서버 환경에서 어떻게 유지되고 문제를 관찰할지도 중요해집니다.
그래서 이번 실습은 운영 전 단계에서 실시간 흐름을 한 번 손으로 붙여보는 준비 단계입니다.
