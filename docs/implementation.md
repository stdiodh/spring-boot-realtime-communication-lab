# Realtime Communication 실습 가이드

`main`은 개념 가이드와 정적 Visual Lab을 위한 브랜치입니다.
코드 실습은 학생 시작 브랜치에서 진행합니다.

```bash
git checkout 08-implementation
```

## 구현 순서

1. `WebSocketConfig.kt`에서 client가 연결할 endpoint를 완성합니다.
2. 같은 설정에서 application destination과 broker topic prefix를 구분합니다.
3. `WebSocketController.kt`에서 들어온 메시지를 topic으로 broadcast하는 handler를 완성합니다.

이번 실습은 연결, 구독, 발행, 수신 흐름에 집중합니다.
인증, 메시지 저장, 채팅방 관리, 재연결 기능은 구현 범위에 포함하지 않습니다.

## 확인 순서

1. 학생 시작 브랜치의 실행 안내에 따라 필요한 컨테이너와 애플리케이션을 시작합니다.
2. 브라우저 탭을 두 개 열고 각각 연결과 구독을 완료합니다.
3. 한 탭에서 메시지를 보내고 두 구독 session의 수신 결과를 확인합니다.
4. transport 연결, STOMP session, topic subscription을 서로 다른 상태로 설명합니다.

구체적인 실행 명령과 테스트 페이지 경로는 학생 시작 브랜치의 `README.md`를 따릅니다.
