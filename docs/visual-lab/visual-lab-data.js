window.visualLabData = {
  sequence: "08",
  title: "Realtime Communication Visual Lab",
  goal: "WebSocket과 STOMP로 연결, 구독, 발행, broadcast 흐름을 HTTP 요청/응답과 구분해서 확인합니다.",
  flow: [
    {
      id: "stomp-broadcast",
      label: "STOMP broadcast",
      problem: "채팅이나 알림처럼 서버가 연결된 화면에 다시 보내야 하는 기능은 HTTP 한 번으로 설명하기 어렵습니다.",
      concept: "WebSocket, STOMP, topic, broadcast",
      action: "connect, subscribe, send, receive 순서로 메시지 흐름을 확인합니다.",
      check: "보내는 경로와 받는 경로가 왜 다른지 설명합니다.",
    },
  ],
  defaultSequence: "08",
  repo: {
    name: "spring-boot-realtime-communication-lab",
    path: "spring-boot-realtime-communication-lab",
  },
  sequences: [
    {
      id: "08",
      title: "Realtime WebSocket",
      topic: "Realtime communication",
      question: "서버가 클라이언트 요청을 기다리지 않고 연결된 화면에 다시 메시지를 보내려면 무엇이 달라질까?",
      goal: "WebSocket 연결, STOMP 경로, topic 구독, server broadcast 흐름을 가장 작은 실시간 메시지 예제로 이해합니다.",
      sourceDocs: [
        { label: "레포 가이드", href: "../repo-guide.md" },
        { label: "시퀀스 맵", href: "../sequence-map.md" },
        { label: "브랜치 가이드", href: "../branch-guide.md" },
      ],
      why: {
        problem: "HTTP는 클라이언트가 요청을 보내고 서버가 응답하는 구조라 채팅이나 알림처럼 서버가 다시 보내는 흐름을 설명하기 어렵습니다.",
        limits: [
          "클라이언트가 계속 새 요청을 보내는 방식은 실시간 전달 흐름을 이해하기에 한계가 있습니다.",
          "전송 prefix와 구독 topic을 같은 경로로 보면 메시지 방향이 흐려집니다.",
          "채팅방, 메시지 저장, 인증 확장을 한 번에 붙이면 가장 작은 broadcast 흐름이 보이지 않습니다.",
        ],
        choice: "이번 시퀀스에서는 connect, subscribe, send, receive 순서와 `/app` 전송 경로, `/topic` 구독 경로를 먼저 분리합니다.",
      },
      overview: [
        "Client Connect",
        "Handshake",
        "Subscribe /topic",
        "Send /app",
        "Message Controller",
        "Server Publish",
        "Client Receive",
      ],
      flows: [
        {
          id: "connect-send-receive",
          title: "connect / subscribe / send / receive",
          summary: "클라이언트가 연결을 만들고 topic을 구독한 뒤 메시지를 보내면 서버가 구독자에게 다시 broadcast합니다.",
          mermaid: "sequenceDiagram\n  actor ClientA\n  actor ClientB\n  participant WS as WebSocket endpoint\n  participant Broker as STOMP broker\n  participant Controller as WebSocketController\n  ClientA->>WS: connect\n  ClientA->>Broker: subscribe /topic/chat\n  ClientB->>WS: connect\n  ClientB->>Broker: subscribe /topic/chat\n  ClientA->>Controller: send /app/chat.send\n  Controller->>Broker: publish /topic/chat\n  Broker-->>ClientA: message\n  Broker-->>ClientB: message",
          steps: [
            { order: 1, actor: "Client", input: "Connect request", owner: "WebSocket endpoint", action: "HTTP 요청/응답과 다른 연결을 엽니다.", output: "Open connection", note: "실시간 메시지는 연결이 유지된 상태에서 주고받습니다." },
            { order: 2, actor: "Client", input: "subscribe /topic/chat", owner: "STOMP broker", action: "서버가 publish할 topic을 구독합니다.", output: "Subscription", note: "받는 경로는 `/topic`으로 읽습니다." },
            { order: 3, actor: "Client", input: "send /app/chat.send", owner: "WebSocketController", action: "메시지를 서버 controller로 보냅니다.", output: "ChatMessage", note: "보내는 경로는 `/app`으로 읽습니다." },
            { order: 4, actor: "WebSocketController", input: "ChatMessage", owner: "STOMP broker", action: "topic 구독자에게 메시지를 publish합니다.", output: "Broadcast message", note: "서버가 연결된 여러 클라이언트에게 다시 보냅니다." },
            { order: 5, actor: "Subscribed clients", input: "Broadcast message", owner: "Browser test page", action: "구독 중인 화면에서 메시지를 받습니다.", output: "Rendered message", note: "브라우저 탭 두 개로 같은 topic 수신을 확인할 수 있습니다." },
          ],
        },
        {
          id: "http-vs-websocket",
          title: "HTTP와 WebSocket 비교",
          summary: "요청/응답이 맞는 기능은 HTTP로 유지하고, 연결된 화면에 서버가 다시 보내야 하는 흐름은 WebSocket으로 봅니다.",
          steps: [
            { order: 1, actor: "Client", input: "HTTP GET request", owner: "Controller", action: "요청 하나에 응답 하나를 돌려줍니다.", output: "HTTP response", note: "조회, 로그인, 캐시 조회처럼 요청 단위가 분명한 기능에 잘 맞습니다." },
            { order: 2, actor: "Client", input: "WebSocket connection", owner: "WebSocket endpoint", action: "연결을 유지합니다.", output: "Connected session", note: "서버가 나중에 다시 메시지를 보낼 수 있는 통로입니다." },
            { order: 3, actor: "Server", input: "Published message", owner: "Topic", action: "구독 중인 클라이언트에게 메시지를 전달합니다.", output: "Realtime update", note: "HTTP와 WebSocket은 경쟁 관계가 아니라 목적이 다릅니다." },
          ],
        },
      ],
      responsibilities: [
        { name: "WebSocketConfig", role: "연결 endpoint, application prefix, broker topic prefix를 설정합니다.", caution: "`/app`과 `/topic`을 같은 의미로 보지 않습니다." },
        { name: "WebSocketController", role: "클라이언트가 보낸 STOMP 메시지를 받고 topic으로 돌려보냅니다.", caution: "HTTP Controller와 annotation과 흐름이 다릅니다." },
        { name: "Message DTO", role: "실시간 메시지 payload를 표현합니다.", caution: "채팅 저장 모델이나 DB Entity와 같은 책임이 아닙니다." },
        { name: "Test page", role: "connect, subscribe, send, receive 순서를 눈으로 확인하는 도구입니다.", caution: "연결 전에 send를 누르면 흐름을 제대로 확인하기 어렵습니다." },
      ],
      concepts: [
        { title: "WebSocket은 연결을 유지합니다", body: "서버가 나중에 클라이언트에게 다시 보낼 수 있는 통로를 만듭니다." },
        { title: "STOMP는 메시지 목적지를 나눕니다", body: "보내는 경로와 구독하는 경로를 명확히 표현합니다." },
        { title: "Topic은 받는 쪽의 약속입니다", body: "구독자는 topic에 publish된 메시지를 받습니다." },
        { title: "Broadcast는 다시 보내는 흐름입니다", body: "서버가 받은 메시지를 topic 구독자들에게 전달합니다." },
      ],
      glossary: [
        { term: "WebSocket", meaning: "클라이언트와 서버 사이에 유지되는 양방향 연결입니다.", caution: "요청 하나와 응답 하나로 끝나는 HTTP와 다릅니다." },
        { term: "STOMP", meaning: "WebSocket 위에서 메시지 목적지와 구독 흐름을 다루는 프로토콜입니다.", caution: "연결 자체와 메시지 경로를 구분해야 합니다." },
        { term: "Topic", meaning: "여러 클라이언트가 구독하는 메시지 목적지입니다.", caution: "서버로 보내는 `/app` 경로와 다릅니다." },
        { term: "Message DTO", meaning: "실시간 메시지 payload를 담는 객체입니다.", caution: "DB 저장 모델이나 채팅방 모델이 아닙니다." },
        { term: "Broadcast", meaning: "서버가 받은 메시지를 구독자들에게 다시 보내는 흐름입니다.", caution: "한 사용자에게만 응답하는 HTTP와 다릅니다." },
      ],
      practical: [
        { title: "가장 작은 broadcast만 봅니다", body: "채팅방 관리, 메시지 저장, 읽음 처리, 인증 확장은 이번 범위를 넘어갑니다." },
        { title: "연결 순서가 중요합니다", body: "connect가 끝나기 전에 subscribe나 send를 실행하면 테스트 화면의 결과가 흔들립니다." },
        { title: "HTTP를 대체하지 않습니다", body: "요청/응답이 맞는 기능은 HTTP로 유지하고, 서버 push가 필요한 곳에 WebSocket을 씁니다." },
      ],
      checks: [
        "HTTP 요청/응답과 WebSocket 연결 유지 흐름의 차이를 설명할 수 있나요?",
        "`/app`으로 보내고 `/topic`으로 받는 이유를 말할 수 있나요?",
        "서버가 topic 구독자에게 다시 publish하는 순서를 설명할 수 있나요?",
        "이번 시퀀스가 채팅 서비스 전체 구현이 아닌 이유를 설명할 수 있나요?",
      ],
      next: {
        id: "09",
        title: "Docker/Runtime",
        reason: "실시간 통신까지 확인했다면, 다음에는 애플리케이션을 jar와 Docker image, runtime config로 실행 가능한 단위로 묶는 흐름을 봅니다.",
      },
    },
  ],
};
