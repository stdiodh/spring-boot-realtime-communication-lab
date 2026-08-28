# 08 Realtime WebSocket

이 브랜치는 08 실습의 완성 구현과 실행 기준입니다. native WebSocket 연결 위에서 STOMP 메시지를 `/app/chat.send`로 보내고 `/topic/chat` 구독자에게 broadcast하는 최소 흐름만 포함합니다.

## 완성된 흐름

| 경로 | 완성 구현의 역할 |
|---|---|
| `/ws-chat` | `WebSocketConfig`가 등록한 native WebSocket endpoint |
| `/app/chat.send` | `WebSocketController`의 `/chat.send` handler로 보내는 destination |
| `/topic/chat` | `@SendTo`와 simple broker가 메시지를 전달하는 구독 topic |

`ChatMessage`는 `sender`, `content`만 가지며 controller는 받은 메시지를 그대로 반환합니다. 메시지 DB 저장, 채팅방, 읽음 처리, JWT WebSocket 인증은 answer 범위가 아닙니다.

`src/main/resources/static/realtime-demo.html`은 Spring Boot가 제공하는 Live Lab입니다. 브라우저 native `WebSocket`과 직접 작성한 STOMP frame만 사용하므로 SockJS, 외부 JavaScript 라이브러리, CDN이 필요하지 않습니다.

## starter와 비교

```bash
git fetch origin
git diff origin/08-implementation..origin/08-answer
```

비교 기준은 정확히 세 묶음입니다.

1. `/ws-chat` endpoint 등록
2. application prefix `/app`과 simple broker prefix `/topic`
3. `/chat.send` handler와 `/topic/chat` broadcast

## 테스트

테스트는 H2와 임의 포트를 사용하므로 MySQL, Redis, Docker 없이 실행됩니다.

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

Spring simple broker는 애플리케이션 프로세스 안에서 동작하며 Redis를 사용하지 않습니다. 다만 현재 전체 애플리케이션의 기본 `bootRun`은 이전 시퀀스에서 상속된 JPA context 때문에 MySQL이 필요합니다.

07 실습의 `aandi-mysql`이 실행 중이면 그대로 재사용합니다. 실행 중인 MySQL이 없다면 이 디렉터리에서 MySQL만 시작합니다.

```bash
docker compose up -d mysql
```

macOS/Linux:

```bash
./gradlew bootRun
```

Windows CMD는 `gradlew.bat bootRun`, PowerShell은 `.\gradlew.bat bootRun`을 사용합니다. 실행 후 `http://localhost:8080/realtime-demo.html`을 엽니다. 페이지와 `/ws-chat`은 실습용 공개 경로이므로 회원가입, 로그인, JWT가 필요하지 않습니다.

## 브라우저 A/B 검증

1. Live Lab을 탭 A와 탭 B에서 열고 두 탭을 연결합니다.
2. 두 탭이 `/topic/chat`을 구독한 상태인지 확인합니다.
3. 탭 A에서 `/app/chat.send`로 메시지를 보냅니다.
4. 탭 A와 탭 B가 같은 메시지를 받는지 확인합니다.
5. 탭 B 연결을 끊고 다시 보내 연결된 구독자만 받는지 확인합니다.

Live Lab의 Subscribe 표시는 `SUBSCRIBE` frame을 보냈다는 뜻입니다. Spring simple broker는 STOMP `RECEIPT`를 지원하지 않으므로, 브라우저에서는 실제 `MESSAGE` 수신이 등록 증거이고 자동화 테스트는 서버의 `SessionSubscribeEvent`를 기다립니다.

## 포트와 컨테이너 충돌

`compose.yaml`은 고정 이름 `aandi-mysql`, `aandi-redis`와 포트 `3306`, `6379`를 사용합니다.

```bash
docker ps -a --format "table {{.Names}}\t{{.Ports}}"
```

- 07 stack의 같은 컨테이너가 실행 중이면 재사용하고, 중지 상태라면 `docker start aandi-mysql`로 MySQL만 다시 시작합니다.
- 다른 Compose 프로젝트가 이름을 소유해 충돌하면 그 프로젝트 디렉터리에서 `docker compose down`한 뒤 다시 시작합니다.
- Redis는 STOMP broker가 아니므로 실시간 실습은 `docker compose up -d mysql`만으로 실행할 수 있습니다.
- `3306`, `6379`, `8080` 점유는 macOS/Linux에서 `lsof -nP -iTCP:<포트> -sTCP:LISTEN`, Windows에서 `netstat -ano | findstr :<포트>`로 확인하고 해당 서비스나 이전 애플리케이션을 종료합니다. 실시간 실습만 한다면 `6379` 점유는 Redis를 시작하지 않는 방식으로 피할 수 있습니다.

## 완료 기준

- 전체 테스트가 통과합니다.
- `/ws-chat`, `/app/chat.send`, `/topic/chat`의 역할을 설명할 수 있습니다.
- 두 native WebSocket session 또는 브라우저 탭 A/B에서 broadcast를 확인했습니다.
- Redis가 이번 simple broker가 아님을 설명할 수 있습니다.
