# 레포 가이드

## 이 레포의 역할

이 레포는 A&I 백엔드 커리큘럼 안에서
실시간 메시지 전달을 입문 수준으로 실습하는 토픽 레포입니다.

한 레포 안에서 아래 시퀀스를 다룹니다.

1. `08`: WebSocket/STOMP 기반 실시간 통신

## 공통 실행 기준

- 런타임 DB는 MySQL을 사용합니다.
- 캐시 저장소는 Redis를 사용합니다.
- 테스트는 H2 in-memory DB를 사용합니다.
- 실시간 테스트 페이지는 `http://localhost:8080/realtime-demo.html`입니다.
- 로컬 실행은 각 브랜치의 `compose.yaml` 기준으로 맞춥니다.

## 이 레포 안에서 학생이 보게 되는 공통 구조

- `README.md`: 현재 브랜치 소개
- `docs/theory.md`: 왜 실시간 통신이 필요한지 설명
- `docs/implementation.md`: 학생이 손으로 칠 순서
- `docs/answer-guide.md`: 강사용 비교 가이드
- `docs/checklist.md`: 학생/강사 체크리스트
- `docs/assets.md`: 미리 제공하는 것 정리

단, 위 구조는 `08-implementation`, `08-answer` 브랜치에서만 실습용으로 보입니다.
`main` 브랜치는 안내 브랜치이므로 레포 운영 문서만 둡니다.

## 학습 순서

1. `spring-boot-redis-cache-lab`의 `07-answer`까지 흐름을 마칩니다.
2. 이 레포 `08-implementation`으로 이동합니다.
3. WebSocket과 STOMP를 이용해 메시지 수신과 broadcast 흐름을 붙입니다.

이 순서가 흔들리면 문서와 코드도 함께 흔들리므로,
학생은 항상 이전 레포 answer 다음 이 레포 implementation 순서로 이동해야 합니다.
