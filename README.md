# Spring Boot Realtime Communication Lab

이 레포는 A&I 백엔드 커리큘럼의 `08. 실시간 통신` 시퀀스를 담는 토픽 레포입니다.
`main`은 가이드 브랜치이고, 학생 실습은 `08-implementation`에서 시작합니다.

## 이 레포에서 배우는 것

- 새 메시지를 보려면 계속 새로고침해야 하는 문제
- HTTP 요청/응답과 WebSocket 연결 유지의 차이
- STOMP connect, subscribe, send, receive 흐름
- 메시지 수신 뒤 topic broadcast로 여러 클라이언트에 전달하는 방식
- 테스트 페이지에서 실시간 송수신을 확인하는 방법

## 시작 방법

```bash
git clone https://github.com/stdiodh/spring-boot-realtime-communication-lab.git
cd spring-boot-realtime-communication-lab
git checkout 08-implementation
```

## 실습 브랜치

| 용도 | 브랜치 |
| --- | --- |
| 가이드 | `main` |
| 학생 시작 | `08-implementation` |
| 참고 정답 | `08-answer` |

## 실행 방법

```bash
docker compose up -d
./gradlew bootRun
```

실시간 테스트 페이지:

```text
http://localhost:8080/realtime-demo.html
```

`main`의 데모는 외부 라이브러리 없이 native WebSocket으로 STOMP frame을 주고받습니다. 페이지와 `/ws-chat/**`은 실습 확인을 위해 공개되어 있으며, 허용 Origin은 `APP_WEBSOCKET_ALLOWED_ORIGIN_PATTERNS`로 제한합니다.

## 테스트 방법

```bash
./gradlew test
```

테스트가 확인하는 것:

- 자동 테스트는 실시간 데모 페이지가 인증 없이 열리는지 확인합니다.
- `/ws-chat` 연결과 `/topic/chat` 구독, `/app/chat.send` 발행은 브라우저에서 수동 확인합니다.
- 탭 두 개에서 발행한 메시지를 각 구독자가 수신하는지 확인합니다.

실패하면 먼저 볼 것:

- connect 완료 전에 subscribe/send가 실행되지 않았는지 확인합니다.
- 구독 경로와 발행 경로를 혼동하지 않았는지 봅니다.
- 실제 브라우저 Origin이 허용 패턴에 포함되는지 확인합니다.

완료 기준:

- 자동 테스트는 실시간 데모 페이지가 인증 없이 열리는지 확인합니다.
- 연결·구독·발행·수신은 테스트 페이지에서 직접 확인합니다.

## 정답과 비교하는 방법

실습 중 막혔거나 완료 후 확인이 필요할 때만 참고 정답 브랜치와 비교합니다.

```bash
git fetch origin
git diff 08-implementation..08-answer
```

## Visual Lab

`main` 가이드 브랜치에는 WebSocket/STOMP 흐름을 훑어보는 Visual Lab 진입점이 있습니다.
이 페이지는 정답 비교 페이지가 아니라 연결, 구독, 발행, 브로드캐스트 순서를 먼저 이해하기 위한 정적 학습 화면입니다.

```text
docs/visual-lab/index.html
```

## 문서 안내

- [이론 정리](./docs/theory.md)
- [구현 안내](./docs/implementation.md)
- [체크리스트](./docs/checklist.md)
- [Visual Lab](./docs/visual-lab/index.html)
