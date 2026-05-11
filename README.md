# Spring Boot Realtime Communication Lab

이 레포는 A&I 백엔드 커리큘럼의 `08. 실시간 통신` 시퀀스를 담는 토픽 레포입니다.
`main`은 가이드 브랜치이고, 학생 실습은 `08-implementation`에서 시작합니다.

## 이 레포에서 배우는 것

- WebSocket/STOMP 기반 실시간 메시지 흐름
- HTTP와 WebSocket 차이
- 메시지 수신 -> topic broadcast -> 실시간 수신
- 테스트 페이지 기반 실시간 확인
- 메시지 타입 분리와 연결 상태 관리 입문

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

## 테스트 방법

```bash
./gradlew test
```

테스트가 확인하는 것:

- WebSocket 연결이 열리는지 확인합니다.
- topic 구독과 메시지 발행 흐름을 확인합니다.
- 발행한 메시지를 구독자가 수신하는지 확인합니다.

실패하면 먼저 볼 것:

- connect 완료 전에 subscribe/send가 실행되지 않았는지 확인합니다.
- 구독 경로와 발행 경로를 혼동하지 않았는지 봅니다.

완료 기준:

- 연결, 구독, 발행, 수신 확인 테스트가 통과합니다.

## 정답과 비교하는 방법

실습 중 막혔거나 완료 후 확인이 필요할 때만 참고 정답 브랜치와 비교합니다.

```bash
git fetch origin
git diff 08-implementation..08-answer
```

## Visual Lab

현재 `main` 가이드 브랜치에는 Visual Lab 진입점이 없습니다.
Visual Lab을 구현할 경우 이 레포의 아래 위치를 사용합니다.

```text
docs/visual-lab/index.html
```

## 문서 안내

- [레포 가이드](./docs/repo-guide.md)
- [브랜치 가이드](./docs/branch-guide.md)
- [시퀀스 맵](./docs/sequence-map.md)
