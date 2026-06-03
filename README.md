# 08 Realtime WebSocket

## 이 시퀀스에서 다루는 문제

이전 시퀀스까지는 대부분 HTTP 요청이 들어오면 서버가 응답하는 흐름을 다뤘습니다. 이번 시퀀스는 연결을 유지한 상태에서 서버가 topic으로 메시지를 다시 보내고, 구독 중인 화면이 그 메시지를 받는 가장 작은 실시간 흐름을 다룹니다.

채팅방 관리, 메시지 저장, 읽음 처리, 사용자 세션 추적, WebSocket 보안 고급 설정은 이번 범위에 포함하지 않습니다.

## 학습 목표

- HTTP 요청/응답과 WebSocket 연결 유지 흐름의 차이를 설명합니다.
- STOMP에서 클라이언트 전송 경로와 topic 구독 경로를 구분합니다.
- 메시지 DTO, WebSocket 설정, 메시지 controller가 어떤 역할로 연결되는지 확인합니다.
- 테스트 페이지에서 connect, send, receive 흐름을 직접 확인합니다.

## 멘티 시작 흐름

실습은 이 starter 브랜치에서 진행합니다.

```bash
git clone -b 08-implementation https://github.com/stdiodh/spring-boot-realtime-communication-lab.git
cd spring-boot-realtime-communication-lab
git checkout -b feat/<이름>
```

먼저 `docs/theory.md`에서 왜 HTTP만으로 실시간 기능을 설명하기 어려운지 읽고, `docs/implementation.md`의 순서대로 TODO를 채웁니다.

## 읽는 순서

1. [이론 정리](./docs/theory.md)
2. [구현 가이드](./docs/implementation.md)
3. [체크리스트](./docs/checklist.md)
4. [제공 자료 안내](./docs/assets.md)

핵심 파일은 아래 순서로 확인합니다.

- `src/main/kotlin/com/andi/rest_crud/dto/ChatMessage.kt`
- `src/main/kotlin/com/andi/rest_crud/config/WebSocketConfig.kt`
- `src/main/kotlin/com/andi/rest_crud/controller/WebSocketController.kt`
- `src/main/resources/static/realtime-demo.html`

## 실행 / 테스트 방법

먼저 필요한 로컬 인프라를 실행합니다.

```bash
docker compose up -d
```

애플리케이션을 실행합니다.

```bash
./gradlew bootRun
```

브라우저에서 테스트 페이지를 엽니다.

```text
http://localhost:8080/realtime-demo.html
```

자동화 테스트는 아래 명령으로 실행합니다.

```bash
./gradlew test
```

## 완료 기준

- WebSocket endpoint와 topic 구독 경로의 역할을 구분해 설명합니다.
- 메시지 DTO가 브라우저와 서버 사이에서 어떤 데이터를 옮기는지 설명합니다.
- 테스트 페이지에서 연결, 발행, 수신 흐름을 확인합니다.
- 이번 시퀀스에서 메시지 저장이나 채팅방 관리로 확장하지 않는 이유를 설명합니다.
- `./gradlew test`가 통과합니다.

<details>
<summary>멘토용 진행 포인트</summary>

## 수업 전 확인

- `compose.yaml`로 MySQL과 Redis가 실행 가능한지 확인합니다.
- `src/main/resources/static/realtime-demo.html`이 `/ws-chat`, `/app/chat.send`, `/topic/chat` 흐름을 사용하고 있는지 확인합니다.
- 이전 시퀀스의 CRUD, 인증, 캐시 기능 설명으로 수업 범위가 새지 않도록 실시간 메시지 흐름에 초점을 맞춥니다.

## 수업 중 질문

- HTTP 응답과 topic broadcast는 메시지를 받는 대상이 어떻게 다른가요?
- `/app`으로 보내는 경로와 `/topic`으로 구독하는 경로를 왜 나누나요?
- 이 단계에서 메시지를 DB에 저장하지 않아도 되는 이유는 무엇인가요?

## 리뷰 기준

- 멘티가 connect, send, receive 순서를 화면에서 설명할 수 있는지 확인합니다.
- controller 구현만 맞추는 데서 끝나지 않고 설정, DTO, 테스트 페이지의 연결 관계를 함께 설명하는지 봅니다.
- 막힌 경우 해결 내용을 직접 알려주기보다 annotation의 역할과 반환 흐름을 질문으로 좁혀갑니다.

</details>
