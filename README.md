# 08 Realtime WebSocket

이 브랜치는 native WebSocket 위에서 STOMP 메시지를 주고받는 학생용 starter입니다. 목표는 완성형 채팅 서비스가 아니라 다음 한 흐름을 직접 완성하는 것입니다.

```text
CONNECT -> SUBSCRIBE -> SEND -> @MessageMapping -> TOPIC BROADCAST -> RECEIVE -> DISCONNECT
```

## 먼저 열 파일 2개

실습 중에는 아래 두 파일만 번호 순서대로 수정합니다.

1. `src/main/kotlin/com/andi/realtime/config/WebSocketConfig.kt`
   - `[1/3] TODO`: WebSocket endpoint 등록
   - `[2/3] TODO`: application/broker prefix 설정
2. `src/main/kotlin/com/andi/realtime/controller/WebSocketController.kt`
   - `[3/3] TODO`: handler와 topic broadcast 구현

`ChatMessage.kt`, Live Lab, 자동 테스트는 제공 코드입니다. 그 밖의 도메인 구현은 이 레포에 없습니다.

## 핵심 경로

| 경로 | 역할 |
|---|---|
| `/ws-chat` | native WebSocket 연결 endpoint |
| `/app/chat.send` | `WebSocketController`로 메시지를 보내는 destination |
| `/topic/chat` | 구독자에게 메시지를 broadcast하는 topic |

Live Lab 소스는 [realtime-demo.html](./src/main/resources/static/realtime-demo.html)입니다. Spring Boot가 직접 제공하며 SockJS, CDN, 별도 프론트엔드 서버를 사용하지 않습니다.

## 테스트

starter에서는 TODO를 완성하기 전 관련 테스트만 실패하는 것이 정상입니다. Docker나 외부 서비스는 필요하지 않습니다.

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

## 실행

macOS/Linux:

```bash
./gradlew bootRun
```

Windows CMD는 `gradlew.bat bootRun`, PowerShell은 `.\gradlew.bat bootRun`을 사용합니다.

콘솔에 `Tomcat started on port 8080`이 표시된 뒤 브라우저 주소창에 다음 URL을 직접 입력합니다.

```text
http://localhost:8080/realtime-demo.html
```

GitHub의 Live Lab 소스 링크는 로컬 Spring Boot 서버를 실행하지 않습니다.

MySQL, Redis, Docker는 사용하지 않습니다. `8080`이 이미 사용 중이면 이전 Spring Boot 프로세스를 종료한 뒤 다시 실행합니다.

## 50분 실습 순서

| 시간 | 작업 |
|---|---|
| 0~8분 | 세 경로와 `ChatMessage` 확인 |
| 8~18분 | `[1/3]` endpoint 등록 |
| 18~28분 | `[2/3]` application/broker prefix 설정 |
| 28~38분 | `[3/3]` handler와 broadcast 완성 |
| 38~50분 | 테스트와 Client A/B 실험 |

상세 구현 순서는 [구현 가이드](./docs/implementation.md), 완료 기준은 [체크리스트](./docs/checklist.md)에서 확인합니다.

## 완료 기준

- 정확히 3개 TODO를 완성했습니다.
- `/ws-chat`, `/app/chat.send`, `/topic/chat`의 역할을 설명할 수 있습니다.
- 전체 테스트가 통과합니다.
- Live Lab의 Client A와 Client B가 같은 broadcast를 수신합니다.
