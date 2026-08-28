# Realtime Communication 체크리스트

## 실습 전

- [ ] `08-implementation` 브랜치에서 시작했습니다.
- [ ] HTTP 요청/응답과 WebSocket 유지 연결의 차이를 설명할 수 있습니다.
- [ ] WebSocket transport와 STOMP messaging을 구분할 수 있습니다.

## 구현

- [ ] 연결 endpoint를 완성했습니다.
- [ ] application destination과 topic prefix를 구분했습니다.
- [ ] message handler가 결과를 topic으로 전달하도록 완성했습니다.
- [ ] 캐시, 인증, 저장 기능을 실습 범위에 추가하지 않았습니다.

## 실행 확인

- [ ] 학생 시작 브랜치의 테스트가 통과합니다.
- [ ] 브라우저 두 탭이 각각 연결되고 topic을 구독합니다.
- [ ] 한 탭에서 보낸 메시지를 구독 session이 수신합니다.
- [ ] 연결, 구독 요청, 실제 메시지 수신을 서로 다른 증거로 설명할 수 있습니다.
- [ ] Origin 제한과 사용자 인증의 차이를 설명할 수 있습니다.
