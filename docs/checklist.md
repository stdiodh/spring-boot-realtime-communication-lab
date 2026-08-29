# 체크리스트

## 학생 구현

- [ ] `[1/3]` native `/ws-chat` endpoint를 등록했습니다.
- [ ] `[2/3]` application prefix `/app`과 broker prefix `/topic`을 설정했습니다.
- [ ] `[3/3]` `/chat.send` handler가 `/topic/chat`으로 broadcast합니다.
- [ ] DTO, DB, 채팅방, 인증으로 범위를 넓히지 않았습니다.

## 자동 테스트

- [ ] `./gradlew test` 또는 Windows 대응 명령을 실행했습니다.
- [ ] handler 반환 테스트가 통과합니다.
- [ ] 두 native WebSocket session의 구독·전송·동시 수신 테스트가 통과합니다.
- [ ] Docker나 외부 서비스 없이 테스트했습니다.

## Live Lab

- [ ] `http://localhost:8080/realtime-demo.html`을 열었습니다.
- [ ] Client A와 B를 연결하고 같은 topic을 구독했습니다.
- [ ] A가 보낸 메시지를 A와 B가 모두 받았습니다.
- [ ] B의 구독 해제 후 다음 메시지는 A만 받았습니다.
- [ ] A의 연결 종료 후 Send가 비활성화됐습니다.

## Swagger

- [ ] `http://localhost:8080/swagger`에서 세 STOMP 경로와 `sender`, `content` payload를 확인했습니다.
- [ ] Swagger는 읽기 전용이고 실제 STOMP 실행은 Live Lab에서 한다는 점을 확인했습니다.

## 설명

- [ ] `/ws-chat`, `/app/chat.send`, `/topic/chat`의 역할을 구분할 수 있습니다.
- [ ] WebSocket과 STOMP의 차이를 설명할 수 있습니다.
- [ ] simple broker가 Redis가 아니라 애플리케이션 안에서 동작함을 설명할 수 있습니다.
