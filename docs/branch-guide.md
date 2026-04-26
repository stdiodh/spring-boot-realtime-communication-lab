# 브랜치 가이드

## 대표 브랜치

- `main`: 레포 소개, 문서 안내, 브랜치 맵 제공

`main`은 학생 실습 브랜치가 아닙니다.
학생은 여기서 현재 목표 시퀀스를 확인한 뒤 `08-implementation`으로 이동합니다.

## 시퀀스 브랜치 맵

| Sequence | 학생 시작 브랜치 | 정답 브랜치 | 핵심 주제 | 상태 |
| --- | --- | --- | --- | --- |
| 08 | `08-implementation` | `08-answer` | WebSocket, STOMP, topic broadcast, 실시간 수신 | Ready |

## 학생용 이동 규칙

1. `08-implementation`으로 이동합니다.
2. 그 브랜치의 `README.md`와 `docs/implementation.md`를 먼저 읽습니다.
3. TODO를 직접 채운 뒤 `08-answer`와 비교합니다.

## 강사용 이동 규칙

1. `main`에서 현재 상태를 확인합니다.
2. `08-answer` 브랜치로 이동합니다.
3. 필요하면 `git diff origin/08-implementation..origin/08-answer`로 비교합니다.

## 운영 규칙

- 새로운 시퀀스를 추가할 때는 먼저 `main` 브랜치의 브랜치 표를 갱신합니다.
- 시퀀스가 완료되면 `starter`, `answer`, `README`, `docs/*` 상태를 함께 점검합니다.
- WebSocket 보안이나 고급 브로커 주제가 분리되면 이 레포 안에 억지로 넣지 않고 새 레포로 나눕니다.
