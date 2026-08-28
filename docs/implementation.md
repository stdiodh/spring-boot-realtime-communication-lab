# 구현 가이드

학생이 수정할 파일은 두 개, TODO는 정확히 세 개입니다. `ChatMessage.kt`, `realtime-demo.html`, 테스트는 수정하지 않습니다.

## [1/3] WebSocket endpoint 등록

파일: `src/main/kotlin/com/andi/realtime/config/WebSocketConfig.kt`

`registerStompEndpoints(...)`에 native `/ws-chat` endpoint를 등록하고 제공된 `allowedOrigins()`를 적용합니다. `.withSockJS()`는 추가하지 않습니다.

## [2/3] application/broker prefix 설정

파일: `src/main/kotlin/com/andi/realtime/config/WebSocketConfig.kt`

`configureMessageBroker(...)`에 application prefix `/app`과 simple broker prefix `/topic`을 설정합니다.

- `/app/chat.send`는 `/chat.send` handler로 들어갑니다.
- `/topic/chat`은 broadcast를 받을 구독 경로입니다.

## [3/3] handler와 broadcast 구현

파일: `src/main/kotlin/com/andi/realtime/controller/WebSocketController.kt`

`ChatMessage`를 `/chat.send`에서 받고 `/topic/chat`으로 보내는 handler를 완성합니다.

- `@MessageMapping("/chat.send")`
- `@SendTo("/topic/chat")`
- 받은 `ChatMessage`를 그대로 반환

DB 저장, 채팅방 분기, 인증 로직을 추가하지 않습니다.

## 검증

```bash
./gradlew test
./gradlew bootRun
```

Windows CMD는 `gradlew.bat`, PowerShell은 `.\gradlew.bat`을 사용합니다. Docker나 별도 프론트엔드 서버는 필요하지 않습니다.

콘솔에 `Tomcat started on port 8080`이 표시된 뒤 브라우저 주소창에 다음 URL을 직접 입력합니다.

```text
http://localhost:8080/realtime-demo.html
```

GitHub에서는 [Live Lab 소스](../src/main/resources/static/realtime-demo.html)만 볼 수 있으며, 실제 실험에는 실행 중인 Spring Boot 서버가 필요합니다.

1. Client A와 B를 연결합니다.
2. 두 client가 `/topic/chat`을 구독합니다.
3. A가 `/app/chat.send`로 메시지를 보냅니다.
4. A와 B가 같은 메시지를 받는지 확인합니다.
5. B의 구독을 해제하고 다시 전송해 A만 받는지 확인합니다.
6. A 연결을 종료하고 Send가 비활성화되는지 확인합니다.
