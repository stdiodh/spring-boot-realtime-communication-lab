# Spring Boot Realtime Communication Lab

이 저장소는 A&I 백엔드 커리큘럼의 `08. 실시간 통신` 가이드입니다.
`main`은 개념 문서와 정적 Visual Lab을 제공하며, 실습용 런타임 구현은 학생 시작 브랜치에서 완성합니다.

## 학습 목표

- HTTP 요청/응답과 WebSocket 유지 연결의 차이를 설명합니다.
- WebSocket transport와 STOMP messaging 상태를 구분합니다.
- application destination과 topic subscription의 역할을 구분합니다.
- 여러 브라우저 session으로 topic broadcast를 확인합니다.

## 실습 시작

```bash
git checkout 08-implementation
```

실행과 테스트는 학생 시작 브랜치의 안내를 따릅니다.

## Visual Lab

`main`의 Visual Lab은 서버 없이 개념 흐름을 살펴보는 정적 페이지입니다.

```bash
python3 -m http.server 8080 -d docs/visual-lab
```

브라우저에서 `http://localhost:8080`을 열고 연결, 구독, 발행, fan-out의 차이를 확인합니다.

## 문서

- [이론 가이드](./docs/theory.md)
- [실습 가이드](./docs/implementation.md)
- [체크리스트](./docs/checklist.md)
- [Visual Lab](./docs/visual-lab/index.html)
