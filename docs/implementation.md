# 구현 가이드

## 1. 구현 전에 확인할 문제

이번 구현은 채팅 서비스를 완성하는 작업이 아닙니다. HTTP 요청/응답으로는 설명하기 어려운 "서버가 연결된 클라이언트에게 다시 메시지를 보내는 흐름"을 가장 작은 단위로 연결하는 작업입니다.

완성해야 할 흐름은 아래와 같습니다.

```text
브라우저 연결 -> 메시지 전송 -> 서버 수신 -> topic broadcast -> 브라우저 수신
```

## 2. 구현 순서

1. `ChatMessage.kt`에서 주고받을 메시지 구조를 확인합니다.
2. `WebSocketConfig.kt`에서 endpoint, 전송 prefix, topic prefix를 확인합니다.
3. `WebSocketController.kt`에서 메시지 수신 메서드를 완성합니다.
4. 같은 흐름에서 topic broadcast가 일어나도록 연결합니다.
5. `realtime-demo.html`에서 connect, send, receive 순서를 확인합니다.

## 3. Step 1. 메시지 DTO 확인

### 해야 할 일

`src/main/kotlin/com/andi/rest_crud/dto/ChatMessage.kt`를 열고 이번 실습에서 메시지에 필요한 값이 무엇인지 확인합니다.

### 왜 이 작업을 하는가

WebSocket으로 오가는 메시지도 서버와 클라이언트가 같은 데이터 구조를 기대해야 합니다. 이번 범위에서는 보낸 사람과 메시지 내용을 확인할 수 있으면 실시간 흐름을 설명할 수 있습니다.

### 확인 방법

- 테스트 페이지 입력 필드와 DTO 필드가 같은 의미를 갖는지 확인합니다.
- 채팅방, 읽음 처리, 저장용 필드를 이번 단계에서 추가하지 않는 이유를 설명합니다.

## 4. Step 2. WebSocket 설정 확인

### 해야 할 일

`src/main/kotlin/com/andi/rest_crud/config/WebSocketConfig.kt`에서 아래 역할을 찾습니다.

- 브라우저가 연결할 endpoint
- 클라이언트가 서버로 메시지를 보낼 때 사용하는 prefix
- 클라이언트가 서버 메시지를 받을 때 구독하는 topic prefix

### 왜 이 작업을 하는가

실시간 통신에서 "어디로 연결하는가", "어디로 보내는가", "어디를 구독하는가"는 서로 다른 역할입니다. 이 구분이 흐려지면 controller 구현이 맞아도 테스트 페이지에서 메시지가 보이지 않을 수 있습니다.

### 확인 방법

- `/ws-chat`, `/app/chat.send`, `/topic/chat`을 각각 한 문장으로 설명합니다.
- 테스트 페이지가 같은 경로를 사용하고 있는지 확인합니다.
- endpoint가 SockJS를 사용하고, 허용 Origin은 `APP_WEBSOCKET_ALLOWED_ORIGIN_PATTERNS`로 제한되는지 확인합니다.

## 5. Step 3. 메시지 수신 메서드 완성

### 해야 할 일

`src/main/kotlin/com/andi/rest_crud/controller/WebSocketController.kt`에서 클라이언트가 보낸 메시지를 받는 메서드를 완성합니다.

### 왜 이 작업을 하는가

HTTP controller가 HTTP 요청을 받는 것처럼, WebSocket controller는 STOMP 메시지를 받는 진입점입니다. 이번 단계에서는 메시지를 저장하거나 변환하기보다 서버가 메시지를 받았다는 흐름을 분명히 만드는 것이 우선입니다.

### 확인 방법

- 메서드가 `ChatMessage`를 받아 처리하는지 확인합니다.
- 테스트를 실행하기 전에 메시지 저장 로직이나 채팅방 분기 로직을 추가하지 않았는지 확인합니다.

## 6. Step 4. topic broadcast 연결

### 해야 할 일

수신 메서드에서 구독 중인 클라이언트가 받을 topic으로 메시지가 이어지도록 연결합니다.

### 왜 이 작업을 하는가

실시간 기능의 핵심은 서버가 받은 메시지를 연결된 클라이언트들에게 다시 전달하는 흐름입니다. 이번 실습은 한 topic으로 다시 보내는 가장 작은 구조를 확인합니다.

### 확인 방법

- 브라우저 탭을 두 개 열고 한쪽에서 보낸 메시지가 다른 쪽에도 표시되는지 확인합니다.
- 메시지 발행 전에 connect가 완료되었는지 확인합니다.

## 7. Step 5. 테스트 페이지에서 확인

### 해야 할 일

아래 순서로 화면을 확인합니다.

1. 애플리케이션을 실행합니다.
2. `http://localhost:8080/realtime-demo.html`을 엽니다.
3. connect 버튼으로 연결합니다.
4. sender와 content를 입력하고 메시지를 보냅니다.
5. 채팅 영역과 이벤트 로그에 수신 결과가 표시되는지 확인합니다.

`realtime-demo.html`과 `/ws-chat/**`은 실습용으로 인증 없이 접근할 수 있습니다. 페이지의 SockJS/STOMP 스크립트는 jsDelivr CDN에서 로드하므로 오프라인에서는 연결 테스트를 진행할 수 없습니다. 이 공개 범위를 운영 보안 기본값으로 사용하지 않습니다.

### 왜 이 작업을 하는가

테스트 페이지는 설정, DTO, controller가 하나의 흐름으로 연결되었는지 확인하는 가장 빠른 진입점입니다.

### 확인 방법

자동화 테스트를 실행합니다.

```bash
./gradlew test
```

## 마지막 확인

- HTTP 요청/응답과 WebSocket 연결 유지 흐름을 구분해 설명합니다.
- `/app/chat.send`와 `/topic/chat`의 역할을 분리해서 설명합니다.
- 메시지 저장, 채팅방 관리, WebSocket 보안 고급 설정을 이번 범위 밖으로 유지합니다.
- 테스트 페이지와 `./gradlew test` 결과를 함께 확인합니다.

<details>
<summary>멘토용 진행 포인트</summary>

- 각 Step에서 경로 이름을 외우게 하기보다 "연결", "전송", "구독" 역할로 설명하도록 질문합니다.
- 힌트가 필요하면 controller annotation의 역할, 반환 흐름, 테스트 페이지 구독 경로 순서로 좁혀갑니다.
- 해결 내용을 먼저 보여주기보다 브라우저 이벤트 로그가 어느 단계에서 멈추는지 확인하게 합니다.
- 구현이 끝나면 메시지 저장을 추가하지 않은 이유와 다음 확장 지점을 설명하게 합니다.

</details>
