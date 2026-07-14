# 체크리스트

## 1. 기능 확인

- [ ] `docker compose up -d`로 필요한 로컬 인프라를 실행했습니다.
- [ ] `./gradlew bootRun`으로 애플리케이션을 실행했습니다.
- [ ] `http://localhost:8080/realtime-demo.html`에서 connect가 완료됩니다.
- [ ] sender와 content를 입력한 뒤 메시지를 보내면 화면에 수신 결과가 표시됩니다.
- [ ] 가능하면 브라우저 탭 두 개에서 같은 topic broadcast 흐름을 확인했습니다.
- [ ] jsDelivr에서 SockJS/STOMP 스크립트를 불러올 수 있는 네트워크 환경인지 확인했습니다.

## 2. 코드 구조 확인

- [ ] `ChatMessage.kt`가 이번 실습에 필요한 최소 메시지 구조를 표현합니다.
- [ ] `WebSocketConfig.kt`에서 endpoint, 전송 prefix, topic prefix의 역할을 설명할 수 있습니다.
- [ ] `APP_WEBSOCKET_ALLOWED_ORIGIN_PATTERNS`와 실습용 `permitAll` 범위를 운영 설정과 구분할 수 있습니다.
- [ ] `WebSocketController.kt`에서 메시지 수신과 broadcast 흐름이 한눈에 보입니다.
- [ ] 메시지 저장, 채팅방 관리, 읽음 처리, 사용자 세션 추적을 이번 범위에 추가하지 않았습니다.

## 3. 실패 케이스 확인

- [ ] connect가 끝나기 전에 send를 눌렀을 때 어떤 문제가 생기는지 설명할 수 있습니다.
- [ ] `/app/chat.send`와 `/topic/chat`을 바꾸어 쓰면 왜 수신이 되지 않는지 설명할 수 있습니다.
- [ ] 테스트 페이지 로그를 보고 연결 문제인지, 전송 문제인지, 구독 문제인지 구분할 수 있습니다.

## 4. 설명할 수 있어야 하는 것

- [ ] HTTP 요청/응답과 WebSocket 연결 유지 흐름의 차이
- [ ] `/ws-chat`, `/app/chat.send`, `/topic/chat`의 역할
- [ ] 메시지 DTO가 필요한 이유
- [ ] 서버가 받은 메시지를 topic으로 다시 보내는 이유
- [ ] 이번 시퀀스에서 메시지를 저장하지 않는 이유

## 5. 남은 한계와 다음 시퀀스 연결

- [ ] 이번 구현은 실시간 메시지 흐름 확인에 집중하며 채팅 서비스 전체 구현이 아닙니다.
- [ ] 운영 환경에서는 연결 유지, timeout, scale-out, 보안 설정을 추가로 고려해야 합니다.
- [ ] 다음 시퀀스에서는 이 애플리케이션을 Docker와 실행 환경 관점에서 다룹니다.
- [ ] `./gradlew test` 결과를 확인했습니다.

<details>
<summary>멘토용 리뷰 기준</summary>

- 통과 기준: 멘티가 화면 시연과 함께 연결, 전송, 구독, broadcast 역할을 구분해 설명합니다.
- 보완 필요 기준: 코드가 동작해도 `/app`과 `/topic`의 역할을 설명하지 못하거나 메시지 저장 등 범위 밖 구현을 추가했습니다.
- 질문 예시: "서버가 HTTP 응답이 아닌 topic으로 메시지를 다시 보내는 이유는 무엇인가요?"
- 비교 포인트: 리뷰 단계에서는 annotation, 반환 흐름, 테스트 페이지 경로가 같은 흐름을 가리키는지 확인합니다.

</details>
