window.visualLabData = {
  "kind": "hub",
  "sequence": "08",
  "title": "Realtime Communication Visual Lab",
  "description": "WebSocket과 STOMP로 연결, 구독, 발행, broadcast 흐름을 HTTP 요청/응답과 구분해서 확인합니다.",
  "repo": {
    "name": "spring-boot-realtime-communication-lab",
    "path": "spring-boot-realtime-communication-lab"
  },
  "visualLabPath": "docs/visual-lab/index.html",
  "visualLabHubPath": "docs/visual-lab/index.html",
  "flow": [
    {
      "id": "stomp-broadcast",
      "label": "STOMP broadcast",
      "problem": "채팅이나 알림처럼 서버가 연결된 화면에 다시 보내야 하는 기능은 HTTP 한 번으로 설명하기 어렵습니다.",
      "concept": "WebSocket, STOMP, topic, broadcast",
      "action": "connect, subscribe, send, receive 순서로 메시지 흐름을 확인합니다.",
      "check": "보내는 경로와 받는 경로가 왜 다른지 설명합니다."
    }
  ],
  "sequences": [
    {
      "sequence": "08",
      "id": "08",
      "title": "Realtime WebSocket",
      "topic": "Realtime communication",
      "href": "./sequences/08/index.html",
      "summary": "서버가 클라이언트 요청을 기다리지 않고 연결된 화면에 다시 메시지를 보내려면 무엇이 달라질까?"
    }
  ]
};
