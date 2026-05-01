# Spring Boot Realtime Communication Lab

이 레포는 A&I 백엔드 커리큘럼 중
`08. 실시간 통신` 시퀀스를 담는 토픽 레포입니다.

`main` 브랜치는 학생이 바로 실습하는 브랜치가 아니라,
이 레포가 어떤 주제를 담고 있고 어떤 브랜치에서 수업을 진행해야 하는지 안내하는 대표 브랜치입니다.

## 이 레포가 다루는 내용

- `08`: WebSocket/STOMP 기반 실시간 메시지 흐름
- HTTP와 WebSocket 차이
- 메시지 수신 -> topic broadcast -> 실시간 수신
- 테스트 페이지 기반 실시간 확인
- 메시지 타입 분리와 연결 상태 관리 입문

즉 이 레포는 "요청이 와야 응답하는 흐름을 넘어, 연결을 유지한 채 서버가 다시 메시지를 보낼 수 있다"는 감각과
"메시지 종류와 연결 상태를 어떻게 구조적으로 보기 시작하는가"를 다루는 실습 레포입니다.

## 브랜치 사용 방법

- `main`: 레포 소개와 브랜치 안내
- `08-implementation`, `08-answer`

학생은 항상 `08-implementation`에서 시작하고,
강사는 `08-answer`에서 비교합니다.

예:

```bash
git clone -b 08-implementation https://github.com/stdiodh/spring-boot-realtime-communication-lab.git
cd spring-boot-realtime-communication-lab
```

## 문서 안내

- [레포 가이드](./docs/repo-guide.md)
- [브랜치 가이드](./docs/branch-guide.md)
- [시퀀스 맵](./docs/sequence-map.md)

각 시퀀스의 실제 실습 문서는 해당 브랜치 안에서 확인합니다.

예:
- `08-implementation`의 `docs/theory.md`, `docs/implementation.md`
- `08-answer`의 `docs/answer-guide.md`

## 실행 기준

- 앱 런타임 DB: MySQL
- 캐시 저장소: Redis
- 테스트 DB: H2 in-memory
- 실시간 endpoint: `/ws-chat`
- 테스트 페이지 경로: `http://localhost:8080/realtime-demo.html`

MySQL과 Redis가 필요할 때는 각 시퀀스 브랜치의 `compose.yaml`을 사용합니다.

## 현재 정리 상태

| Sequence | Starter | Answer | Status |
| --- | --- | --- | --- |
| 08 | `08-implementation` | `08-answer` | Ready |

## 이 레포를 어떻게 보면 좋나요

1. 먼저 `main`에서 이 README와 `docs/branch-guide.md`를 읽습니다.
2. `08-implementation` 브랜치로 이동합니다.
3. 그 브랜치의 `README.md`, `docs/theory.md`, `docs/implementation.md` 순서로 봅니다.
4. 실습 후 `08-answer` 브랜치와 비교합니다.

## 운영 메모

- 이 레포는 `spring-boot-redis-cache-lab`의 `07-answer` 다음 단계에서 분리된 새 토픽 레포입니다.
- 이 레포의 `main` 브랜치는 실습 완료본이 아니라 안내 브랜치입니다.
- 시퀀스 문서는 각 브랜치 안에서 계속 바뀌어야 하며, 이전 시퀀스 문서를 그대로 재사용하면 안 됩니다.
