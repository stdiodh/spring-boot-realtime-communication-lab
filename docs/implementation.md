# 완성 구현 가이드

이 문서는 `08-implementation`의 3개 TODO를 완성한 결과를 비교하고 실행하는 기준입니다.

## 1. endpoint 등록

파일: `src/main/kotlin/com/andi/rest_crud/config/WebSocketConfig.kt`

```kotlin
registry.addEndpoint("/ws-chat")
    .setAllowedOriginPatterns(*allowedOriginPatterns.split(",").map(String::trim).toTypedArray())
```

`/ws-chat`은 native WebSocket endpoint입니다. answer에는 `.withSockJS()`가 없습니다.

## 2. application/broker prefix

같은 파일의 `configureMessageBroker(...)`가 두 방향을 나눕니다.

```kotlin
registry.enableSimpleBroker("/topic")
registry.setApplicationDestinationPrefixes("/app")
```

- `/app/chat.send`는 application prefix를 거쳐 `/chat.send` handler로 들어갑니다.
- `/topic/chat`은 Spring simple broker가 구독자에게 전달합니다.
- 이 simple broker는 Redis가 아닙니다.

## 3. handler와 broadcast

파일: `src/main/kotlin/com/andi/rest_crud/controller/WebSocketController.kt`

```kotlin
@MessageMapping("/chat.send")
@SendTo("/topic/chat")
fun send(message: ChatMessage): ChatMessage = message
```

controller는 `ChatMessage`를 저장하거나 변환하지 않고 그대로 반환합니다. 반환값은 `/topic/chat`을 구독한 모든 연결에 전달됩니다.

## 4. 자동화 테스트

macOS/Linux:

```bash
./gradlew test
```

Windows CMD:

```bat
gradlew.bat test
```

Windows PowerShell:

```powershell
.\gradlew.bat test
```

테스트는 H2와 임의 포트를 사용하므로 Docker가 필요하지 않습니다.

| 테스트 | 보장하는 동작 |
|---|---|
| `WebSocketControllerTest` | handler가 받은 `ChatMessage`를 그대로 반환 |
| `RealtimeWebSocketIntegrationTest` | `SessionSubscribeEvent`로 두 session의 topic 등록을 기다린 뒤 같은 메시지를 수신 |
| `RealtimeDemoAccessIntegrationTest` | 정적 Live Lab HTML의 A/B client, destination, native WebSocket 계약 |

## 5. Live Lab 실행

현재 전체 앱의 기본 `bootRun`에는 상속된 JPA context 때문에 MySQL이 필요합니다. Redis는 simple broker가 아닙니다. 07의 `aandi-mysql`이 실행 중이면 재사용하고, 없다면 아래처럼 MySQL만 시작합니다.

```bash
docker compose up -d mysql
./gradlew bootRun
```

Windows에서는 두 번째 명령을 CMD의 `gradlew.bat bootRun` 또는 PowerShell의 `.\gradlew.bat bootRun`으로 바꿉니다.

`http://localhost:8080/realtime-demo.html`을 탭 A와 B에서 엽니다. 두 탭을 연결한 뒤 A에서 보내고 두 탭이 받는지 확인합니다. B의 연결을 끊고 다시 보내면 연결된 구독자만 받아야 합니다.

Live Lab은 브라우저 native WebSocket으로 STOMP frame을 직접 처리합니다. SockJS, CDN, 회원가입, 로그인, JWT는 필요하지 않습니다.

Spring simple broker는 `SUBSCRIBE`에 대한 STOMP `RECEIPT`를 지원하지 않습니다. Live Lab의 Subscribe 표시는 frame 전송 상태이고, 실제 `MESSAGE` 수신이 브라우저에서 확인할 수 있는 등록 증거입니다.

## 6. starter 비교 기준

```bash
git diff origin/08-implementation..origin/08-answer
```

비교 대상은 endpoint, 두 prefix, handler/broadcast의 세 TODO뿐입니다. DTO, 메시지 저장, 채팅방, 인증을 학생 구현 범위로 해석하지 않습니다.
