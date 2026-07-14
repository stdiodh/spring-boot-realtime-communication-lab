# 08 Realtime WebSocket

## 이 시퀀스에서 다루는 문제

이번 answer 브랜치는 starter에서 구현한 실시간 메시지 흐름을 확인하는 비교 기준입니다. HTTP 요청/응답만으로는 서버가 연결된 화면에 바로 메시지를 다시 보내는 흐름을 설명하기 어렵기 때문에, WebSocket/STOMP 기반의 가장 작은 broadcast 구조를 완성된 상태로 제공합니다.

채팅방 관리, 메시지 저장, 읽음 처리, 사용자 세션 추적, WebSocket 보안 고급 설정은 이번 시퀀스의 비교 범위에 포함하지 않습니다.

## 학습 목표

- HTTP 요청/응답과 WebSocket 연결 유지 흐름의 차이를 설명합니다.
- `/ws-chat`, `/app/chat.send`, `/topic/chat`의 역할을 분리해 설명합니다.
- `ChatMessage`, `WebSocketConfig`, `WebSocketController`, `realtime-demo.html`이 어떤 순서로 연결되는지 비교합니다.
- starter 구현과 answer 구현의 차이를 테스트 결과와 함께 확인합니다.

## 멘티 시작 흐름

먼저 starter 브랜치에서 직접 구현한 뒤, 이 브랜치의 문서를 비교 기준으로 사용합니다.

```bash
git fetch origin
git diff origin/08-implementation..origin/08-answer
```

비교할 때는 코드 줄 수보다 연결, 전송, 구독, broadcast 역할이 같은 방향을 가리키는지 확인합니다.

## 읽는 순서

1. [이론 정리](./docs/theory.md)
2. [구현 가이드](./docs/implementation.md)
3. [체크리스트](./docs/checklist.md)

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

이 페이지와 `/ws-chat/**`은 실습 확인을 위해 공개되어 있으며, SockJS/STOMP 클라이언트를 jsDelivr CDN에서 불러오므로 브라우저 테스트에는 네트워크 연결이 필요합니다.

자동화 테스트는 아래 명령으로 실행합니다.

```bash
./gradlew test
```

## 완료 기준

- 테스트 페이지에서 connect, send, receive 흐름을 확인합니다.
- `WebSocketController`가 받은 메시지를 topic으로 다시 보내는 구조를 설명합니다.
- starter 구현과 비교해 누락된 annotation, 반환 흐름, 경로 연결을 찾을 수 있습니다.
- 이번 시퀀스가 실시간 통신 입문 범위를 넘지 않는 이유를 설명합니다.

<details>
<summary>멘토용 진행 포인트</summary>

## 수업 전 확인

- answer 브랜치에서 `./gradlew test`가 통과하는지 확인합니다.
- 비교 설명은 `ChatMessage`, `WebSocketConfig`, `WebSocketController`, 테스트 페이지 경로 순서로 준비합니다.
- 이전 시퀀스의 CRUD, 인증, 캐시 기능은 배경으로만 두고 실시간 메시지 흐름에 초점을 맞춥니다.

## 수업 중 질문

- starter 구현에서 메시지가 화면에 보이지 않는다면 어느 단계부터 확인해야 하나요?
- `/app/chat.send`와 `/topic/chat`을 같은 경로로 두지 않는 이유는 무엇인가요?
- 이번 answer가 메시지 저장까지 포함하지 않는 이유는 무엇인가요?

## 리뷰 기준

- 멘티가 answer 코드를 그대로 외우는 것이 아니라 경로, annotation, 반환 흐름을 연결해서 설명하는지 봅니다.
- 동작 확인은 테스트 통과와 브라우저 시연을 함께 기준으로 둡니다.
- 범위 밖 확장 아이디어는 다음 단계 후보로 기록하고 이번 구현에는 넣지 않습니다.

</details>
