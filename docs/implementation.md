# 실시간 통신 구현 안내

## 이 도메인이 필요한 이유

지금까지의 대부분 기능은 HTTP 요청이 들어왔을 때만 응답하는 구조였습니다.
하지만 채팅이나 알림처럼 서버가 바로 다시 알려줘야 하는 기능은
이 요청-응답 한 번짜리 흐름만으로는 설명하기 어렵습니다.

그래서 이번 실습은 WebSocket 연결을 작게 붙여서,
메시지를 받고 다시 topic으로 뿌리는 가장 단순한 실시간 흐름을 직접 연결하는 단계입니다.

## 오늘 학생이 완성할 최종 흐름

1. 브라우저가 `/ws-chat`에 연결합니다.
2. 클라이언트가 `sender`, `content`를 담은 메시지를 보냅니다.
3. 서버가 메시지를 받습니다.
4. 서버가 `/topic/chat`으로 다시 보냅니다.
5. 구독 중인 브라우저가 메시지를 바로 표시합니다.

## 학생이 직접 구현할 순서

1. `ChatMessage.kt`에서 메시지 DTO 필드를 확인합니다.
2. `WebSocketConfig.kt`에서 endpoint와 topic 흐름을 확인합니다.
3. `WebSocketController.kt`에서 메시지 수신 메서드를 완성합니다.
4. 같은 클래스에서 topic broadcast 흐름을 완성합니다.
5. `realtime-demo.html`에서 메시지를 보내고 다시 받는지 확인합니다.

## TODO를 넣을 파일

- `src/main/kotlin/com/andi/rest_crud/dto/ChatMessage.kt`
- `src/main/kotlin/com/andi/rest_crud/config/WebSocketConfig.kt`
- `src/main/kotlin/com/andi/rest_crud/controller/WebSocketController.kt`

핵심 TODO는 `WebSocketController.kt`에 가장 많이 모이고,
`ChatMessage.kt`, `WebSocketConfig.kt`는 실시간 흐름이 성립하는 기본 구조를 이해하는 역할을 맡습니다.

## 각 파일의 역할

### `ChatMessage.kt`

- 실시간으로 주고받을 최소 데이터 구조를 정의합니다.
- sender와 content 정도만 있어도 흐름을 이해하기에 충분합니다.

### `WebSocketConfig.kt`

- WebSocket endpoint와 STOMP broker 설정을 준비합니다.
- 클라이언트가 어디로 보내고, 어디를 구독할지 여기서 드러납니다.

### `WebSocketController.kt`

- 실시간 메시지 수신과 다시 보내는 핵심 흐름을 담당합니다.
- 이번 시퀀스에서 가장 중요한 파일입니다.

## 단계별 구현 안내

### Step 1. 메시지 DTO 만들기

`ChatMessage.kt`에서 어떤 값이 꼭 필요한지 먼저 봅니다.
이번 실습은 채팅 도메인을 깊게 확장하지 않으므로,
`sender`, `content` 정도만 있어도 충분합니다.

### Step 2. 메시지 수신 메서드 만들기

`WebSocketController.kt`에서 아래 순서로 구현합니다.

1. 클라이언트가 보낼 경로를 `@MessageMapping`으로 연결합니다.
2. `ChatMessage`를 파라미터로 받아 서버가 메시지를 받게 합니다.
3. 받은 메시지를 다음 단계에서 다시 보낼 준비를 합니다.

### Step 3. topic broadcast 연결

같은 메서드에서 아래 순서로 마무리합니다.

1. `@SendTo("/topic/chat")`를 연결합니다.
2. 받은 메시지를 그대로 반환하거나 필요한 최소 변형만 합니다.
3. 구독 중인 클라이언트가 이 topic을 받는다고 생각하며 흐름을 확인합니다.

### Step 4. 테스트 페이지에서 확인

`realtime-demo.html`에서 아래 순서로 확인합니다.

1. connect 버튼으로 WebSocket 연결을 엽니다.
2. subscribe가 자동으로 연결되는지 확인합니다.
3. sender, content를 입력해 send 버튼을 누릅니다.
4. 아래 로그 영역에 같은 메시지가 다시 찍히는지 봅니다.

## 각 단계의 확인 포인트

- DTO 단계: sender와 content가 브라우저와 서버 사이에서 일관되게 쓰이는가
- 설정 단계: endpoint와 topic 경로를 구분해서 설명할 수 있는가
- controller 단계: 메시지를 받고 다시 보내는 흐름이 한 메서드에서 보이는가
- 테스트 단계: 보낸 메시지가 실시간으로 다시 표시되는가

## 실행 확인 방법

1. 아래 명령으로 애플리케이션을 실행합니다.

```bash
./gradlew bootRun
```

2. 브라우저에서 아래 페이지를 엽니다.

```text
http://localhost:8080/realtime-demo.html
```

3. connect를 누른 뒤 메시지를 보냅니다.
4. 로그에 실시간으로 메시지가 다시 표시되는지 확인합니다.

테스트는 아래처럼 실행합니다.

```bash
./gradlew test
```

## 학생 체크 질문

- 왜 이 기능은 HTTP 요청 하나만으로 설명하기 어려운가요?
- 메시지 DTO에 어떤 값이 들어가야 흐름이 보이나요?
- 서버가 받은 메시지를 다시 보내는 지점은 어디인가요?
- `/app/chat.send`와 `/topic/chat`을 각각 어떻게 설명할 수 있나요?

## 강사용 확인 포인트

- HTTP 요청/응답과 실시간 메시지 흐름 차이를 그림으로 보여줄 수 있는가
- connect -> send -> receive 순서를 시연할 준비가 되었는가
- WebSocketConfig에서 endpoint와 topic을 구분해 설명할 수 있는가
- 이번 단계에서 메시지 저장이나 채팅방 관리까지 확장하지 않는 이유가 분명한가

## 다음 도메인 연결 포인트

다음 시퀀스에서 배포와 운영 환경으로 넘어가면,
이 실시간 연결이 실제 서버 환경에서 어떻게 유지되고 문제를 관찰할지까지 생각해야 합니다.
이번 실습은 그 전에 실시간 통신의 가장 작은 동작 단위를 손으로 붙여보는 단계입니다.
