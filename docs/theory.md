# 이론 정리

## 1. 왜 이 개념이 필요한가

HTTP 요청/응답은 클라이언트가 요청한 시점에 서버가 응답하는 구조입니다. 게시글 조회, 로그인, 캐시 조회처럼 요청 단위가 분명한 기능에는 이 흐름이 잘 맞습니다.

채팅이나 알림처럼 서버가 연결된 화면에 다시 메시지를 보내야 하는 기능은 요청/응답 한 번으로 설명하기 어렵습니다. 이번 answer 브랜치는 WebSocket과 STOMP를 이용해 연결을 유지하고 topic으로 메시지를 다시 보내는 최소 구현을 보여줍니다.

## 2. 기존 방식의 한계

HTTP만 사용하면 클라이언트가 새 요청을 보내야 서버의 새 상태를 확인할 수 있습니다. 실시간처럼 보이게 만들려면 반복 조회 같은 우회 방식이 필요하지만, 이번 시퀀스의 목표는 그런 우회가 아니라 연결 유지와 broadcast 흐름을 직접 확인하는 것입니다.

## 3. 이번 시퀀스에서 선택한 접근

완성 흐름은 아래 다섯 단계입니다.

1. 브라우저가 `/ws-chat` endpoint에 연결합니다.
2. 클라이언트가 `/app/chat.send`로 메시지를 보냅니다.
3. 서버 controller가 `ChatMessage`를 받습니다.
4. 서버가 `/topic/chat`으로 메시지를 다시 보냅니다.
5. `/topic/chat`을 구독 중인 브라우저가 메시지를 화면에 표시합니다.

채팅방 관리, 메시지 저장, 읽음 처리, 사용자 세션 추적은 이번 구현의 범위가 아닙니다. answer 코드는 경로와 annotation의 연결 관계를 확인하기 위한 기준입니다.

## 4. 핵심 개념

### HTTP

HTTP는 클라이언트 요청이 먼저 오고 서버가 그 요청에 응답하는 방식입니다. `PostController`, `AuthController` 같은 REST API에서 이 흐름을 볼 수 있습니다.

### WebSocket

WebSocket은 연결을 유지한 채 클라이언트와 서버가 메시지를 주고받을 수 있는 통신 방식입니다. 이번 코드에서는 `/ws-chat` endpoint가 연결 진입점입니다.

### STOMP 경로

STOMP에서는 클라이언트가 서버로 보내는 경로와 클라이언트가 구독하는 경로를 나눕니다. 이번 구현에서는 `/app/chat.send`가 전송 경로이고, `/topic/chat`이 구독 topic입니다.

### 메시지 DTO

`ChatMessage`는 실시간으로 오가는 데이터 구조입니다. 이번 answer에서는 `sender`, `content`만으로 보낸 사람과 메시지 내용을 확인합니다.

### topic broadcast

topic broadcast는 특정 topic을 구독 중인 클라이언트들에게 같은 메시지를 다시 보내는 흐름입니다. HTTP 응답처럼 요청한 한 명에게만 돌아가는 구조와 다릅니다.

## 5. 짧은 예제와 해설

`WebSocketController`의 핵심은 클라이언트가 보낸 메시지를 받고 같은 topic으로 다시 보내는 것입니다.

```kotlin
@MessageMapping("/chat.send")
@SendTo("/topic/chat")
fun send(message: ChatMessage): ChatMessage {
    return message
}
```

`@MessageMapping`은 클라이언트가 `/app/chat.send`로 보낸 메시지를 받는 지점입니다. `@SendTo`는 반환값을 `/topic/chat` 구독자에게 다시 보내는 지점입니다. 이 둘이 함께 있어야 테스트 페이지에서 발행 후 수신 흐름을 볼 수 있습니다.

설정 파일에서는 broker와 endpoint가 같은 흐름을 뒷받침합니다.

```kotlin
registry.enableSimpleBroker("/topic")
registry.setApplicationDestinationPrefixes("/app")
registry.addEndpoint("/ws-chat").setAllowedOriginPatterns("*").withSockJS()
```

`/ws-chat`은 연결 endpoint, `/app`은 서버로 보내는 prefix, `/topic`은 클라이언트가 구독하는 prefix입니다.

## 6. 다음 구현으로 연결되는 지점

answer 비교 후에는 아래 질문으로 구현을 설명할 수 있어야 합니다.

- `/ws-chat`, `/app/chat.send`, `/topic/chat`은 각각 어떤 역할인가요?
- `@MessageMapping`과 `@SendTo`는 어떤 흐름을 이어주나요?
- 메시지를 DB에 저장하지 않아도 실시간 흐름을 확인할 수 있는 이유는 무엇인가요?
- 테스트 페이지에서 connect, send, receive는 어떤 순서로 일어나나요?

다음 시퀀스에서 배포와 실행 환경을 다룰 때는 이런 연결이 실제 서버 환경에서 어떻게 유지되고 관찰되는지도 중요해집니다.

<details>
<summary>멘토용 설명 포인트</summary>

- starter 구현과 비교할 때 경로 문자열보다 각 경로의 역할을 먼저 설명하게 합니다.
- 멘티가 `return message`만 외우지 않도록 annotation, 반환값, 구독 topic의 관계를 함께 확인합니다.
- 메시지 저장이나 채팅방 분리 질문이 나오면 다음 확장 주제로 남기고 이번 범위에서는 broadcast 흐름만 검증합니다.

</details>
