window.visualLabData = {
  sequence: "08",
  title: "Realtime WebSocket",
  goal: "브라우저 연결, 구독, 발행, 브로드캐스트가 어떤 순서로 이어지는지 본다.",
  problem: "HTTP 요청/응답은 서버가 먼저 클라이언트에게 메시지를 밀어 보내기 어렵습니다. 이 시퀀스는 연결을 유지한 상태에서 구독자에게 실시간 메시지를 전달하는 흐름을 다룹니다.",
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
      label: "연결 시작",
      problem: "실시간 메시지는 요청마다 새 연결을 만드는 방식으로 다루기 어렵습니다.",
      concept: "WebSocket은 클라이언트와 서버가 연결을 유지하며 메시지를 주고받는 통로입니다.",
      action: "브라우저가 WebSocket endpoint에 연결을 요청합니다.",
      check: "연결 URL과 허용 origin 설정을 확인합니다.",
    },
    {
      id: "subscribe",
      label: "Topic 구독",
      problem: "클라이언트가 어떤 메시지를 받을지 정하지 않으면 브로드캐스트 대상이 불명확합니다.",
      concept: "Subscribe는 특정 topic의 메시지를 받겠다고 등록하는 동작입니다.",
      action: "클라이언트가 받을 메시지 topic을 구독합니다.",
      check: "구독 destination이 서버의 발행 destination과 맞는지 확인합니다.",
    },
    {
      id: "send",
      label: "메시지 발행",
      problem: "클라이언트 payload와 서버 DTO가 어긋나면 메시지가 처리되지 않습니다.",
      concept: "STOMP는 발행 목적지와 구독 목적지를 나누어 메시지를 전달합니다.",
      action: "사용자가 보낸 메시지가 서버의 메시지 처리 메서드로 들어옵니다.",
      check: "payload 필드가 서버 DTO와 일치하는지 확인합니다.",
    },
    {
      id: "process",
      label: "서버 처리",
      problem: "실시간 메시지도 검증과 실패 처리를 생략하면 운영 중 원인을 찾기 어렵습니다.",
      concept: "Message Controller는 실시간 메시지의 서버 진입점입니다.",
      action: "서버가 메시지 저장, 검증, 응답 변환 같은 필요한 작업을 수행합니다.",
      check: "실패한 메시지가 조용히 사라지지 않도록 처리 흐름을 확인합니다.",
    },
    {
      id: "broadcast",
      label: "브로드캐스트",
      problem: "한 사용자에게만 보이면 topic broadcast 흐름을 확인했다고 보기 어렵습니다.",
      concept: "Broadcast는 같은 topic을 구독한 여러 클라이언트에게 메시지를 전달합니다.",
      action: "처리된 메시지를 같은 topic을 구독한 클라이언트에게 전달합니다.",
      check: "두 개 이상의 브라우저에서 같은 메시지가 보이는지 확인합니다.",
    },
  ],
  practice: [
    "연결, 구독, 발행 destination을 구분한다.",
    "서버 DTO와 클라이언트 payload가 맞는지 확인한다.",
    "여러 클라이언트에 브로드캐스트되는지 확인한다.",
    "연결 완료 전에 subscribe/send가 실행되지 않는지 확인한다.",
  ],
  mentorHints: [
    "멘티가 HTTP와 WebSocket 차이를 연결 유지 관점에서 설명하는지 확인합니다.",
    "정답을 직접 제시하기보다 connect, subscribe, send, broadcast 중 어디가 실패했는지 나누게 합니다.",
    "이번 시퀀스는 대규모 채팅 시스템이 아니라 실시간 메시지 흐름 입문 범위임을 유지합니다.",
  ],
};
