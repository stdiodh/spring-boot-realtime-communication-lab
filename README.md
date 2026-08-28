# 08 Realtime WebSocket

이 브랜치는 native WebSocket 위에서 STOMP 메시지를 주고받는 학생용 starter입니다. 목표는 채팅 서비스를 만드는 것이 아니라, 연결 endpoint와 전송·구독 경로를 구분하고 한 메시지가 두 브라우저에 broadcast되는 흐름을 완성하는 것입니다.

## 핵심 경로

| 경로 | 역할 |
|---|---|
| `/ws-chat` | 브라우저가 native WebSocket 연결을 시작하는 endpoint |
| `/app/chat.send` | 클라이언트가 `WebSocketController`로 메시지를 보내는 STOMP destination |
| `/topic/chat` | 두 브라우저가 broadcast 메시지를 받기 위해 구독하는 topic |

`src/main/resources/static/realtime-demo.html`은 Spring Boot가 직접 제공하는 Live Lab입니다. 브라우저의 `WebSocket` API로 연결하고 필요한 STOMP frame을 직접 보내므로 SockJS, 외부 JavaScript 라이브러리, CDN이 필요하지 않습니다.

## 학생이 구현할 정확한 범위

TODO는 아래 3개뿐입니다.

1. `WebSocketConfig.registerStompEndpoints(...)`에 `/ws-chat` endpoint를 등록합니다.
2. `WebSocketConfig.configureMessageBroker(...)`에 application prefix `/app`과 simple broker prefix `/topic`을 설정합니다.
3. `WebSocketController`에 `/chat.send` handler와 `/topic/chat` broadcast를 연결합니다.

`ChatMessage.kt`와 `realtime-demo.html`은 제공 코드입니다. 메시지 저장, 채팅방, 읽음 처리, JWT WebSocket 인증은 구현 범위가 아닙니다.

## 50분 실습 순서

| 시간 | 작업 |
|---|---|
| 0~8분 | 세 경로와 `ChatMessage` 구조 확인 |
| 8~18분 | TODO 1: native WebSocket endpoint 등록 |
| 18~28분 | TODO 2: application/broker prefix 설정 |
| 28~38분 | TODO 3: handler와 broadcast 완성 |
| 38~50분 | 전체 테스트와 브라우저 A/B 실험 |

상세 순서는 [구현 가이드](./docs/implementation.md), 완료 기준은 [체크리스트](./docs/checklist.md)에서 확인합니다.

## 테스트

테스트는 H2를 사용하므로 MySQL, Redis, Docker 없이 실행됩니다. starter는 TODO를 모두 완성하기 전에는 관련 테스트가 실패하는 것이 정상입니다.

macOS/Linux:

```bash
./gradlew test
```

Windows CMD:

```bat
gradlew.bat test
```

Windows PowerShell에서는 `.\gradlew.bat test`를 사용합니다.

## 애플리케이션과 Live Lab 실행

Spring simple broker는 애플리케이션 프로세스 안에서 동작하므로 Redis가 필요하지 않습니다. 다만 현재 애플리케이션에는 이전 시퀀스의 JPA 설정이 남아 있어 기본 `bootRun`에는 MySQL이 필요합니다.

07 실습의 `aandi-mysql` 컨테이너가 실행 중이면 그대로 재사용하고 새 compose stack을 올리지 않습니다. 실행 중인 MySQL이 없다면 이 디렉터리에서 MySQL만 시작합니다.

```bash
docker compose up -d mysql
```

애플리케이션 실행:

```bash
./gradlew bootRun
```

Windows CMD는 `gradlew.bat bootRun`, PowerShell은 `.\gradlew.bat bootRun`을 사용합니다. 브라우저에서 `http://localhost:8080/realtime-demo.html`을 엽니다. 이 페이지와 `/ws-chat`은 실습용 공개 경로이므로 회원가입, 로그인, JWT가 필요하지 않습니다.

## 브라우저 A/B 실험

1. Live Lab을 탭 A와 탭 B에서 엽니다.
2. 두 탭을 모두 연결해 `/topic/chat`을 구독합니다.
3. 탭 A에서 `/app/chat.send`로 메시지를 보냅니다.
4. 탭 A와 탭 B에 같은 메시지가 표시되는지 확인합니다.
5. 탭 B 연결을 끊은 뒤 다시 보내고, 연결된 구독자만 받는지 확인합니다.

Live Lab의 Subscribe 표시는 `SUBSCRIBE` frame을 보냈다는 뜻입니다. Spring simple broker는 STOMP `RECEIPT`를 지원하지 않으므로, 브라우저에서는 실제 `MESSAGE` 수신이 등록 증거이고 자동화 테스트는 서버의 `SessionSubscribeEvent`를 기다립니다.

## 포트와 컨테이너 충돌

`compose.yaml`은 고정 이름 `aandi-mysql`, `aandi-redis`와 포트 `3306`, `6379`를 사용합니다.

```bash
docker ps -a --format "table {{.Names}}\t{{.Ports}}"
```

- 07 stack의 같은 컨테이너가 실행 중이면 재사용하고, 중지 상태라면 `docker start aandi-mysql`로 MySQL만 다시 시작합니다.
- 다른 Compose 프로젝트가 이름을 소유해 충돌하면 그 프로젝트 디렉터리에서 `docker compose down`한 뒤 다시 시작합니다.
- 실시간 실습만 진행할 때 Redis는 broker가 아니므로 `docker compose up -d mysql`만으로 충분합니다.
- `3306`, `6379`, `8080` 점유는 macOS/Linux에서 `lsof -nP -iTCP:<포트> -sTCP:LISTEN`, Windows에서 `netstat -ano | findstr :<포트>`로 확인하고 해당 서비스나 이전 애플리케이션을 종료합니다. 실시간 실습만 한다면 `6379` 점유는 Redis를 시작하지 않는 방식으로 피할 수 있습니다.

## 완료 기준

- 정확히 3개 TODO를 완성했습니다.
- `/ws-chat`, `/app/chat.send`, `/topic/chat`의 역할을 설명할 수 있습니다.
- `./gradlew test` 또는 Windows 대응 명령이 통과합니다.
- 두 브라우저 탭에서 같은 topic broadcast를 확인했습니다.
