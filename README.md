# 08 Realtime WebSocket

이 브랜치는 Spring Boot WebSocket/STOMP 수업의 완성 구현입니다. 채팅 서비스가 아니라 다음 한 흐름만 실험합니다.

```text
CONNECT → SUBSCRIBE → SEND → @MessageMapping → TOPIC BROADCAST → RECEIVE → DISCONNECT
```

## 코드 지도

| 파일 | 역할 |
|---|---|
| `src/main/kotlin/com/andi/realtime/config/WebSocketConfig.kt` | `/ws-chat`, `/app`, `/topic` 설정 |
| `src/main/kotlin/com/andi/realtime/controller/WebSocketController.kt` | `/chat.send` 메시지를 `/topic/chat`으로 broadcast |
| `src/main/kotlin/com/andi/realtime/dto/ChatMessage.kt` | `sender`, `content` payload |
| `src/main/resources/static/realtime-demo.html` | Client A/B Live Lab |
| `src/main/resources/static/openapi/realtime.yaml` | 읽기 전용 WebSocket/STOMP 계약 |

## 실행

MySQL, Redis, Docker, 별도 프론트엔드 서버가 필요하지 않습니다.

macOS/Linux:

```bash
./gradlew clean test
./gradlew bootRun
```

Windows CMD에서는 `gradlew.bat`, PowerShell에서는 `.\gradlew.bat`를 사용합니다.

콘솔에 `Tomcat started on port 8080`이 표시된 뒤 브라우저 주소창에 다음 URL을 직접 입력합니다.

```text
http://localhost:8080/realtime-demo.html
```

GitHub에서 파일 내용만 확인하려면 [realtime-demo.html](./src/main/resources/static/realtime-demo.html)을 엽니다. GitHub의 파일 링크는 로컬 Spring Boot 서버를 실행하지 않습니다.

`http://localhost:8080/swagger`에서는 endpoint, destination, payload 명세를 읽을 수 있습니다. STOMP는 HTTP API가 아니므로 Swagger의 Try it out은 비활성화되어 있으며, 실제 연결과 메시지 실험은 Live Lab에서 진행합니다.

## Live Lab

1. Client A와 B를 각각 Connect합니다.
2. 두 client가 `/topic/chat`을 Subscribe합니다.
3. A가 `/app/chat.send`로 메시지를 Send합니다.
4. A와 B가 같은 메시지를 받는지 확인합니다.
5. B를 Unsubscribe하고 다시 보내 A만 받는지 확인합니다.
6. Disconnect 후 Send가 비활성화되는지 확인합니다.

Subscribe 표시는 `SUBSCRIBE` frame을 보냈다는 뜻입니다. Spring simple broker는 구독 receipt를 지원하지 않으므로 실제 `MESSAGE` 수신으로 등록을 확인합니다.

## implementation과 비교

```bash
git diff origin/08-implementation..origin/08-answer
```

학생 구현 범위는 endpoint 등록, 두 destination prefix 설정, handler/broadcast의 세 TODO뿐입니다. 메시지 저장, 채팅방, 인증, Redis broker는 범위에 포함하지 않습니다.

## 문제 해결

- `8080`이 사용 중이면 기존 Spring Boot 프로세스를 종료한 뒤 다시 실행합니다.
- 연결에 실패하면 애플리케이션 실행 여부와 `/ws-chat` 경로를 확인합니다.
- 다른 origin에서 페이지를 열어야 한다면 `APP_WEBSOCKET_ALLOWED_ORIGIN_PATTERNS`를 쉼표로 구분해 지정합니다.
