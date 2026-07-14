# 구현 가이드

## 1. 구현 전에 확인할 문제

이번 answer는 WebSocket/STOMP를 이용해 서버가 받은 메시지를 topic으로 다시 보내는 최소 구현입니다. 목적은 채팅 서비스를 완성하는 것이 아니라, 연결 유지와 broadcast 흐름이 코드에서 어떻게 이어지는지 비교하는 것입니다.

완성 흐름은 아래와 같습니다.

```text
브라우저 연결 -> 메시지 전송 -> 서버 수신 -> topic broadcast -> 브라우저 수신
```

## 2. 구현 순서

1. `ChatMessage.kt`에서 주고받을 메시지 구조를 확인합니다.
2. `WebSocketConfig.kt`에서 endpoint, 전송 prefix, topic prefix를 확인합니다.
3. `WebSocketController.kt`에서 메시지 수신 메서드를 확인합니다.
4. 같은 메서드에서 topic broadcast가 어떻게 연결되는지 확인합니다.
5. `realtime-demo.html`에서 connect, send, receive 순서를 확인합니다.

## 3. Step 1. 메시지 DTO 확인

### 해야 할 일

`src/main/kotlin/com/andi/rest_crud/dto/ChatMessage.kt`가 이번 실습에 필요한 최소 필드를 담는지 확인합니다.

```kotlin
data class ChatMessage(
    val sender: String,
    val content: String
)
```

### 왜 이 작업을 하는가

서버와 브라우저가 같은 데이터 구조를 기대해야 메시지를 안정적으로 주고받을 수 있습니다. 이번 범위에서는 보낸 사람과 메시지 내용만 확인하면 실시간 흐름을 설명할 수 있습니다.

### 확인 방법

- 테스트 페이지 입력 필드와 DTO 필드가 같은 의미를 갖는지 확인합니다.
- 채팅방, 읽음 처리, 저장용 필드가 answer에 포함되지 않은 이유를 설명합니다.

## 4. Step 2. WebSocket 설정 확인

### 해야 할 일

`src/main/kotlin/com/andi/rest_crud/config/WebSocketConfig.kt`에서 연결 endpoint와 STOMP 경로 규칙을 확인합니다.

```kotlin
registry.enableSimpleBroker("/topic")
registry.setApplicationDestinationPrefixes("/app")
registry.addEndpoint("/ws-chat")
    .setAllowedOriginPatterns(*allowedOriginPatterns)
    .withSockJS()
```

### 왜 이 작업을 하는가

`/ws-chat`은 연결 endpoint이고, `/app`은 클라이언트가 서버로 보낼 때 사용하는 prefix이며, `/topic`은 클라이언트가 서버 메시지를 받을 때 구독하는 prefix입니다. 세 역할이 분리되어야 테스트 페이지와 controller 흐름을 함께 설명할 수 있습니다.
개발 환경은 localhost Origin만 기본 허용하고, 운영에서는 `APP_WEBSOCKET_ALLOWED_ORIGIN_PATTERNS`로 실제 프런트 Origin을 지정합니다. `realtime-demo.html`과 `/ws-chat/**`의 `permitAll`은 실습용 공개 범위이며 운영 인증 정책이 아닙니다.

### 확인 방법

- `/ws-chat`, `/app/chat.send`, `/topic/chat`을 각각 한 문장으로 설명합니다.
- 테스트 페이지가 같은 경로를 사용하고 있는지 확인합니다.

## 5. Step 3. 메시지 수신 메서드 확인

### 해야 할 일

`src/main/kotlin/com/andi/rest_crud/controller/WebSocketController.kt`에서 클라이언트가 보낸 메시지를 받는 메서드를 확인합니다.

```kotlin
@MessageMapping("/chat.send")
@SendTo("/topic/chat")
fun send(message: ChatMessage): ChatMessage {
    return message
}
```

### 왜 이 작업을 하는가

`@MessageMapping`은 클라이언트 전송 경로를 controller 메서드로 연결합니다. `ChatMessage` 파라미터는 브라우저에서 보낸 메시지를 서버 객체로 받는 지점입니다.

### 확인 방법

- starter 구현과 비교해 메시지 수신 annotation과 DTO 파라미터가 맞게 연결되었는지 확인합니다.
- 메시지 저장이나 채팅방 분기 로직이 이번 answer에 없는 이유를 설명합니다.

## 6. Step 4. topic broadcast 확인

### 해야 할 일

수신 메서드의 반환값이 `/topic/chat` 구독자에게 다시 전달되는지 확인합니다.

### 왜 이 작업을 하는가

실시간 기능의 핵심은 서버가 받은 메시지를 연결된 클라이언트들에게 다시 전달하는 흐름입니다. 이번 answer는 메시지를 그대로 반환해 broadcast 구조를 가장 작게 보여줍니다.

### 확인 방법

- 브라우저 탭을 두 개 열고 한쪽에서 보낸 메시지가 다른 쪽에도 표시되는지 확인합니다.
- 메시지 발행 전에 connect가 완료되었는지 확인합니다.

## 7. Step 5. 테스트 페이지에서 확인

### 해야 할 일

아래 순서로 화면을 확인합니다.

1. 애플리케이션을 실행합니다.
2. `http://localhost:8080/realtime-demo.html`을 엽니다.
3. connect 버튼으로 연결합니다.
4. sender와 content를 입력하고 메시지를 보냅니다.
5. 채팅 영역과 이벤트 로그에 수신 결과가 표시되는지 확인합니다.

테스트 페이지의 SockJS/STOMP 스크립트는 jsDelivr CDN에서 로드되므로 브라우저 테스트에는 네트워크 연결이 필요합니다. 운영에서는 외부 자산 버전 고정과 공급 방식을 별도로 결정합니다.

### 왜 이 작업을 하는가

테스트 페이지는 설정, DTO, controller가 하나의 흐름으로 연결되었는지 확인하는 가장 빠른 진입점입니다.

### 확인 방법

자동화 테스트를 실행합니다.

```bash
./gradlew test
```

## 마지막 확인

- HTTP 요청/응답과 WebSocket 연결 유지 흐름을 구분해 설명합니다.
- `/app/chat.send`와 `/topic/chat`의 역할을 분리해서 설명합니다.
- starter 구현과 비교해 누락된 annotation, 반환 흐름, 경로 연결을 찾습니다.
- 테스트 페이지와 `./gradlew test` 결과를 함께 확인합니다.

<details>
<summary>멘토용 진행 포인트</summary>

- 각 Step에서 경로 이름보다 "연결", "전송", "구독" 역할을 먼저 설명하게 합니다.
- starter와 비교할 때 `return message` 자체보다 `@SendTo`와 topic 구독자의 관계를 확인시킵니다.
- 구현이 끝나면 메시지 저장을 추가하지 않은 이유와 다음 확장 지점을 설명하게 합니다.

</details>
