# Spring Boot Realtime Communication Lab

> WebSocket과 STOMP로 가장 단순한 실시간 메시지 흐름을 붙여보는 실습 레포입니다.

## 이 시퀀스에서 무엇을 배우나요

이번 실습은 `07-answer`까지 만든 HTTP 기반 애플리케이션 위에
실시간 메시지 전달 흐름을 추가하는 단계입니다.

이번 레포에서는 아래 흐름에 집중합니다.

1. 클라이언트가 메시지를 보냅니다.
2. 서버가 메시지를 받습니다.
3. 서버가 topic으로 다시 메시지를 보냅니다.
4. 연결된 클라이언트가 실시간으로 메시지를 받습니다.

## 브랜치 사용 방법

- `main`: 이 레포의 주제, 문서, 브랜치 구조를 안내하는 대표 브랜치
- `08-implementation`: 학생 실습용 starter 브랜치
- `08-answer`: 비교용 정답 브랜치

학생은 반드시 `08-implementation`에서 시작합니다.

```bash
git clone -b 08-implementation https://github.com/stdiodh/spring-boot-realtime-communication-lab.git
cd spring-boot-realtime-communication-lab
git checkout -b feat/<이름>
```

정답 비교가 필요할 때는 아래 흐름을 사용합니다.

```bash
git fetch origin
git diff origin/08-implementation..origin/08-answer
```

## 문서 안내

- [이론 문서](./docs/theory.md)
- [구현 안내](./docs/implementation.md)
- [정답 가이드](./docs/answer-guide.md)
- [체크리스트](./docs/checklist.md)
- [제공 자료 안내](./docs/assets.md)

## 파일을 어떻게 보면 좋나요

1. `docs/theory.md`에서 왜 HTTP만으로는 실시간 기능이 불편한지 읽습니다.
2. `docs/implementation.md`에서 오늘 손으로 칠 순서를 확인합니다.
3. 아래 핵심 파일을 순서대로 엽니다.

- `src/main/kotlin/com/andi/rest_crud/dto/ChatMessage.kt`
- `src/main/kotlin/com/andi/rest_crud/config/WebSocketConfig.kt`
- `src/main/kotlin/com/andi/rest_crud/controller/WebSocketController.kt`
- `src/main/resources/static/realtime-demo.html`

`08-answer`는 완성된 비교용 기준 브랜치입니다.
학생 구현과 비교할 때는 `docs/answer-guide.md`와 함께 보면 좋습니다.

## 미리 제공되는 것

- `07-answer` 기준 CRUD, 인증, 캐시 관련 코드
- WebSocket/STOMP 의존성 설정
- 테스트용 HTML 페이지
- 기본 보안 설정과 패키지 구조
- MySQL + Redis 실행용 `compose.yaml`

학생은 실시간 메시지 수신과 broadcast 핵심 흐름만 직접 구현합니다.

## 실행 방법

먼저 필요한 로컬 인프라를 올립니다.

```bash
docker compose up -d
```

애플리케이션 실행:

```bash
./gradlew bootRun
```

테스트 페이지:

```text
http://localhost:8080/realtime-demo.html
```

테스트 실행:

```bash
./gradlew test
```

## 이번 실습에서 직접 구현할 범위

- 메시지 DTO 필드 확인
- WebSocket endpoint와 topic 흐름 확인
- 메시지 수신 메서드 구현
- topic broadcast 연결
- 테스트 페이지에서 송수신 결과 확인

이번 시퀀스에서는 채팅방 관리, 메시지 저장, 읽음 처리, 사용자 세션 추적, WebSocket 보안 고급 설정까지 확장하지 않습니다.
