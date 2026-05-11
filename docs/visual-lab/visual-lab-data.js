window.visualLabData = {
  sequence: "08",
  title: "Realtime WebSocket",
  goal: "브라우저 연결, 구독, 발행, 브로드캐스트가 어떤 순서로 이어지는지 본다.",
  implementationBranch: "08-implementation",
  concepts: [
    {
      name: "WebSocket",
      description: "클라이언트와 서버가 연결을 유지하며 양방향 메시지를 주고받는다.",
    },
    {
      name: "STOMP",
      description: "구독과 발행 목적지를 명확히 나누는 메시징 규칙이다.",
    },
    {
      name: "Subscribe",
      description: "클라이언트가 특정 topic의 메시지를 받겠다고 등록한다.",
    },
    {
      name: "Broadcast",
      description: "서버가 topic을 구독한 여러 클라이언트에게 메시지를 전달한다.",
    },
  ],
  flow: [
    {
      id: "connect",
      title: "브라우저가 연결한다",
      actor: "Browser",
      target: "WebSocket Endpoint",
      description: "클라이언트가 WebSocket endpoint에 연결을 요청한다.",
      checkpoint: "연결 URL과 허용 origin 설정을 확인한다.",
    },
    {
      id: "subscribe",
      title: "topic을 구독한다",
      actor: "Browser",
      target: "Message Broker",
      description: "클라이언트는 받을 메시지 topic을 구독한다.",
      checkpoint: "구독 destination이 서버의 발행 destination과 맞는지 확인한다.",
    },
    {
      id: "send",
      title: "메시지를 발행한다",
      actor: "Browser",
      target: "Message Controller",
      description: "사용자가 보낸 메시지가 서버의 메시지 처리 메서드로 들어온다.",
      checkpoint: "payload 필드가 서버 DTO와 일치하는지 확인한다.",
    },
    {
      id: "process",
      title: "서버가 메시지를 처리한다",
      actor: "Message Controller",
      target: "Service",
      description: "서버는 메시지 저장, 검증, 응답 변환 같은 필요한 작업을 수행한다.",
      checkpoint: "실패한 메시지가 조용히 사라지지 않도록 처리 흐름을 확인한다.",
    },
    {
      id: "broadcast",
      title: "구독자에게 전달한다",
      actor: "Message Broker",
      target: "Subscribers",
      description: "처리된 메시지가 같은 topic을 구독한 클라이언트에게 전달된다.",
      checkpoint: "두 개 이상의 브라우저에서 같은 메시지가 보이는지 확인한다.",
    },
  ],
  checkpoints: [
    "연결, 구독, 발행 destination을 구분한다.",
    "서버 DTO와 클라이언트 payload가 맞는지 확인한다.",
    "여러 클라이언트에 브로드캐스트되는지 확인한다.",
    "실습은 08-implementation 브랜치에서 시작한다.",
  ],
};
