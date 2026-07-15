window.visualLabData = {
  "kind": "sequence",
  "sequence": "08",
  "title": "Realtime WebSocket",
  "subtitle": "Realtime communication",
  "goal": "WebSocket 연결, STOMP 경로, topic 구독, server broadcast 흐름을 가장 작은 실시간 메시지 예제로 이해합니다.",
  "problem": "HTTP는 클라이언트가 요청을 보내고 서버가 응답하는 구조라 채팅이나 알림처럼 서버가 다시 보내는 흐름을 설명하기 어렵습니다.",
  "repo": {
    "name": "spring-boot-realtime-communication-lab",
    "path": "spring-boot-realtime-communication-lab"
  },
  "defaultSequence": "08",
  "workbench": {
    "kind": "realtime",
    "title": "Connection & Broadcast Console",
    "instruction": "연결과 구독 상태를 선택해 STOMP 메시지가 어느 destination을 지나 어떤 브라우저 탭까지 도달하는지 추적하세요.",
    "nodes": {
      "browserA": {
        "label": "Browser A",
        "icon": "client",
        "kind": "client",
        "role": "WebSocket 연결과 STOMP session을 만들고 ChatMessage를 발행합니다.",
        "boundary": "브라우저"
      },
      "browserB": {
        "label": "Browser B",
        "icon": "client",
        "kind": "client",
        "role": "같은 topic을 구독하고 broker가 broadcast한 ChatMessage를 받습니다.",
        "boundary": "브라우저"
      },
      "demoUiGuard": {
        "label": "Demo UI connection guard",
        "icon": "gate",
        "kind": "gate",
        "role": "main 데모에서 CONNECTED 전 send를 비활성화하고 CONNECTED 뒤 자동 subscribe합니다.",
        "boundary": "브라우저"
      },
      "originGate": {
        "label": "Allowed Origin gate",
        "icon": "security",
        "kind": "gate",
        "role": "HTTP Upgrade 전에 브라우저 Origin이 허용 패턴과 맞는지 검사합니다.",
        "boundary": "WebSocket handshake",
        "codePointIds": [
          "websocket-config"
        ]
      },
      "websocketEndpoint": {
        "label": "WebSocket endpoint",
        "icon": "websocket",
        "kind": "websocket",
        "role": "native WebSocket transport가 연결되는 /ws-chat 입구입니다.",
        "boundary": "WebSocket transport",
        "codePointIds": [
          "websocket-config"
        ]
      },
      "stompRouter": {
        "label": "STOMP message router",
        "icon": "handler",
        "kind": "handler",
        "role": "CONNECT, SUBSCRIBE, SEND frame을 session과 destination 규칙에 따라 라우팅합니다.",
        "boundary": "STOMP protocol"
      },
      "webSocketController": {
        "label": "WebSocketController",
        "icon": "api",
        "kind": "handler",
        "role": "/app/chat.send의 ChatMessage를 받고 @SendTo 결과를 반환합니다.",
        "boundary": "애플리케이션 메시징",
        "codePointIds": [
          "topic-broadcast"
        ]
      },
      "subscriptionRegistry": {
        "label": "Subscription registry",
        "icon": "broker",
        "kind": "broker",
        "role": "/topic/chat을 구독한 STOMP session 목록을 유지합니다.",
        "boundary": "STOMP broker"
      },
      "simpleBroker": {
        "label": "Simple Broker",
        "icon": "broker",
        "kind": "broker",
        "role": "/topic destination의 MESSAGE를 현재 구독 session에 fan-out합니다.",
        "boundary": "STOMP broker",
        "codePointIds": [
          "websocket-config",
          "topic-broadcast"
        ]
      }
    },
    "scenarios": [
      {
        "id": "subscribed-broadcast",
        "label": "두 탭 구독 · 정상 broadcast",
        "flowId": "connect-send-receive",
        "tone": "recovered",
        "prompt": "두 브라우저 탭이 같은 topic을 구독한 뒤 한 탭에서 메시지를 보냅니다.",
        "diagram": {
          "caption": "main 데모의 native WebSocket STOMP 흐름입니다. raw frame 왕복과 두 탭 수신은 브라우저에서 수동 확인하며 자동 테스트는 demo page 접근만 보장합니다.",
          "lanes": [
            {
              "id": "websocket-transport",
              "label": "WebSocket transport",
              "description": "두 탭은 STOMP frame을 보내기 전에 Origin 검사를 거쳐 /ws-chat transport를 각각 엽니다.",
              "steps": [
                {
                  "from": "browserA",
                  "to": "originGate",
                  "verb": "handshake 요청",
                  "payload": "GET Upgrade /ws-chat + Origin",
                  "kind": "request",
                  "concept": "WebSocket handshake",
                  "codePointIds": [
                    "websocket-config"
                  ]
                },
                {
                  "from": "originGate",
                  "to": "websocketEndpoint",
                  "verb": "Origin 허용",
                  "payload": "Browser A WebSocket upgrade",
                  "kind": "call"
                },
                {
                  "from": "websocketEndpoint",
                  "to": "browserA",
                  "verb": "transport 연결",
                  "payload": "WebSocket open",
                  "kind": "response"
                },
                {
                  "from": "browserB",
                  "to": "originGate",
                  "verb": "handshake 요청",
                  "payload": "GET Upgrade /ws-chat + Origin",
                  "kind": "request"
                },
                {
                  "from": "originGate",
                  "to": "websocketEndpoint",
                  "verb": "Origin 허용",
                  "payload": "Browser B WebSocket upgrade",
                  "kind": "call"
                },
                {
                  "from": "websocketEndpoint",
                  "to": "browserB",
                  "verb": "transport 연결",
                  "payload": "WebSocket open",
                  "kind": "response"
                }
              ]
            },
            {
              "id": "stomp-session-subscription",
              "label": "STOMP session + subscription",
              "description": "/ws-chat 연결과 /topic/chat 구독은 다른 약속입니다. 각 탭은 CONNECTED 뒤 topic을 구독합니다.",
              "steps": [
                {
                  "from": "browserA",
                  "to": "stompRouter",
                  "verb": "STOMP session 요청",
                  "payload": "CONNECT frame · STOMP 1.2",
                  "kind": "event"
                },
                {
                  "from": "stompRouter",
                  "to": "browserA",
                  "verb": "session 준비 완료",
                  "payload": "CONNECTED frame",
                  "kind": "response"
                },
                {
                  "from": "browserB",
                  "to": "stompRouter",
                  "verb": "STOMP session 요청",
                  "payload": "CONNECT frame · STOMP 1.2",
                  "kind": "event"
                },
                {
                  "from": "stompRouter",
                  "to": "browserB",
                  "verb": "session 준비 완료",
                  "payload": "CONNECTED frame",
                  "kind": "response"
                },
                {
                  "from": "browserA",
                  "to": "subscriptionRegistry",
                  "verb": "topic 구독",
                  "payload": "SUBSCRIBE destination:/topic/chat",
                  "kind": "event",
                  "concept": "Subscription"
                },
                {
                  "from": "browserB",
                  "to": "subscriptionRegistry",
                  "verb": "topic 구독",
                  "payload": "SUBSCRIBE destination:/topic/chat",
                  "kind": "event"
                },
                {
                  "from": "subscriptionRegistry",
                  "to": "simpleBroker",
                  "verb": "수신자 집합 등록",
                  "payload": "/topic/chat → Browser A + Browser B sessions",
                  "kind": "config"
                }
              ]
            },
            {
              "id": "send-broadcast",
              "label": "SEND → broadcast",
              "description": "/app destination은 Controller로, /topic destination은 구독자 fan-out으로 이어집니다.",
              "steps": [
                {
                  "from": "browserA",
                  "to": "stompRouter",
                  "verb": "메시지 발행",
                  "payload": "SEND destination:/app/chat.send + ChatMessage JSON",
                  "kind": "event",
                  "concept": "Application destination"
                },
                {
                  "from": "stompRouter",
                  "to": "webSocketController",
                  "verb": "handler 호출",
                  "payload": "@MessageMapping /chat.send + ChatMessage",
                  "kind": "call",
                  "codePointIds": [
                    "topic-broadcast"
                  ]
                },
                {
                  "from": "webSocketController",
                  "to": "simpleBroker",
                  "verb": "broadcast 결과 발행",
                  "payload": "@SendTo /topic/chat + ChatMessage",
                  "kind": "event",
                  "concept": "Broker destination"
                },
                {
                  "from": "simpleBroker",
                  "to": "subscriptionRegistry",
                  "verb": "현재 구독자 조회",
                  "payload": "/topic/chat",
                  "kind": "call"
                },
                {
                  "from": "subscriptionRegistry",
                  "to": "simpleBroker",
                  "verb": "구독 session 반환",
                  "payload": "Browser A + Browser B",
                  "kind": "response"
                },
                {
                  "from": "simpleBroker",
                  "to": "browserA",
                  "verb": "구독자 fan-out",
                  "payload": "MESSAGE frame + ChatMessage",
                  "kind": "event"
                },
                {
                  "from": "simpleBroker",
                  "to": "browserB",
                  "verb": "구독자 fan-out",
                  "payload": "MESSAGE frame + ChatMessage",
                  "kind": "event",
                  "check": "두 탭 화면의 parsed sender/content와 DevTools raw frame 증거를 구분합니다."
                }
              ]
            }
          ]
        },
        "route": [
          "Browser A",
          "/ws-chat",
          "STOMP CONNECTED",
          "SUBSCRIBE /topic/chat",
          "SEND /app/chat.send",
          "WebSocketController",
          "STOMP Broker",
          "/topic/chat",
          "Browser subscribers"
        ],
        "snapshot": [
          {
            "label": "Connection",
            "value": "CONNECTED",
            "tone": "recovered"
          },
          {
            "label": "Publish destination",
            "value": "/app/chat.send",
            "tone": "signal"
          },
          {
            "label": "Broadcast destination",
            "value": "/topic/chat",
            "tone": "recovered"
          }
        ],
        "evidence": "두 탭의 테스트 페이지에서 같은 MESSAGE frame과 payload가 수신되는지 확인합니다.",
        "outcome": "서버가 받은 ChatMessage를 같은 topic의 모든 구독 탭에 다시 전달합니다.",
        "fanOut": [
          "발신 탭",
          "두 번째 구독 탭"
        ]
      },
      {
        "id": "connect-not-ready",
        "label": "연결 전 조작 · 중단",
        "flowId": "connect-send-receive",
        "tone": "blocked",
        "prompt": "CONNECTED frame을 확인하기 전에 subscribe 또는 send를 시도합니다.",
        "diagram": {
          "caption": "현재 main 데모는 CONNECTED 전에 send 버튼을 비활성화하고 CONNECTED를 받으면 자동 subscribe합니다. 이 diagram은 실제 UI가 조기 조작을 막는 경계를 보여줍니다.",
          "lanes": [
            {
              "id": "connection-not-ready",
              "label": "CONNECTING · operation blocked",
              "description": "WebSocket transport가 열려도 STOMP CONNECTED를 받기 전에는 구독과 발행 준비가 끝난 것이 아닙니다.",
              "steps": [
                {
                  "from": "browserA",
                  "to": "originGate",
                  "verb": "handshake 요청",
                  "payload": "GET Upgrade /ws-chat + Origin",
                  "kind": "request"
                },
                {
                  "from": "originGate",
                  "to": "websocketEndpoint",
                  "verb": "Origin 허용",
                  "payload": "WebSocket upgrade",
                  "kind": "call"
                },
                {
                  "from": "websocketEndpoint",
                  "to": "browserA",
                  "verb": "transport 연결",
                  "payload": "WebSocket open",
                  "kind": "response"
                },
                {
                  "from": "browserA",
                  "to": "stompRouter",
                  "verb": "STOMP session 요청",
                  "payload": "CONNECT frame · CONNECTING",
                  "kind": "event"
                },
                {
                  "from": "browserA",
                  "to": "demoUiGuard",
                  "verb": "조기 send 시도",
                  "payload": "connection state != CONNECTED",
                  "kind": "call"
                },
                {
                  "from": "demoUiGuard",
                  "to": "browserA",
                  "verb": "조작 차단",
                  "payload": "sendButton disabled",
                  "kind": "failure",
                  "check": "main 데모에서는 조기 SEND frame이 서버까지 전달되지 않습니다."
                }
              ]
            }
          ],
          "notReached": [
            {
              "label": "Subscription registry",
              "reason": "CONNECTED 처리 전이라 /topic/chat 구독을 만들지 않습니다."
            },
            {
              "label": "WebSocketController · Simple Broker",
              "reason": "SEND가 UI에서 차단되어 application destination과 broadcast 경계에 도달하지 않습니다."
            }
          ]
        },
        "route": [
          "Browser",
          "/ws-chat",
          "STOMP CONNECTED",
          "SUBSCRIBE /topic/chat",
          "SEND /app/chat.send",
          "WebSocketController",
          "/topic/chat",
          "Browser receive"
        ],
        "snapshot": [
          {
            "label": "Connection",
            "value": "CONNECTING",
            "tone": "blocked"
          },
          {
            "label": "Subscription",
            "value": "생성되지 않음",
            "tone": "warning"
          },
          {
            "label": "Receive",
            "value": "확인할 수 없음",
            "tone": "blocked"
          }
        ],
        "evidence": "테스트 페이지의 연결 상태에 CONNECTED가 표시되지 않았고 MESSAGE frame도 없는지 확인합니다.",
        "outcome": "연결 완료를 먼저 확인한 뒤 subscribe와 send 순서로 다시 진행해야 합니다.",
        "stopAfter": 1
      },
      {
        "id": "sender-not-subscribed",
        "label": "발신 탭 미구독 · 부분 수신",
        "flowId": "connect-send-receive",
        "tone": "warning",
        "prompt": "발신 탭은 연결만 하고, 두 번째 탭만 /topic/chat을 구독한 상태에서 메시지를 보냅니다.",
        "diagram": {
          "caption": "send와 receive가 별도 계약임을 보여주는 개념·수동 시나리오입니다. 현재 main 데모는 CONNECTED 뒤 자동 subscribe하므로 수정 없는 기본 UI만으로 발신 탭 미구독 상태를 만들 수 없습니다.",
          "lanes": [
            {
              "id": "sender-session-and-send",
              "label": "Browser A · send only",
              "description": "별도 STOMP client를 가정해 Browser A는 session만 만든 뒤 topic 구독 없이 application destination으로 보냅니다.",
              "steps": [
                {
                  "from": "browserA",
                  "to": "originGate",
                  "verb": "handshake 요청",
                  "payload": "GET Upgrade /ws-chat + Origin",
                  "kind": "request"
                },
                {
                  "from": "originGate",
                  "to": "websocketEndpoint",
                  "verb": "Origin 허용",
                  "payload": "WebSocket upgrade",
                  "kind": "call"
                },
                {
                  "from": "browserA",
                  "to": "stompRouter",
                  "verb": "STOMP session 요청",
                  "payload": "CONNECT frame",
                  "kind": "event"
                },
                {
                  "from": "stompRouter",
                  "to": "browserA",
                  "verb": "session 준비 완료",
                  "payload": "CONNECTED frame",
                  "kind": "response"
                },
                {
                  "from": "browserA",
                  "to": "stompRouter",
                  "verb": "구독 없이 메시지 발행",
                  "payload": "SEND /app/chat.send + ChatMessage JSON",
                  "kind": "event"
                },
                {
                  "from": "stompRouter",
                  "to": "webSocketController",
                  "verb": "handler 호출",
                  "payload": "ChatMessage",
                  "kind": "call"
                },
                {
                  "from": "webSocketController",
                  "to": "simpleBroker",
                  "verb": "topic으로 발행",
                  "payload": "/topic/chat + ChatMessage",
                  "kind": "event"
                }
              ]
            },
            {
              "id": "subscriber-only-fanout",
              "label": "Browser B · subscribed receiver",
              "description": "Broker는 발신자 여부가 아니라 현재 topic 구독 session만 수신자로 선택합니다.",
              "steps": [
                {
                  "from": "browserB",
                  "to": "subscriptionRegistry",
                  "verb": "topic 구독",
                  "payload": "SUBSCRIBE destination:/topic/chat",
                  "kind": "event"
                },
                {
                  "from": "subscriptionRegistry",
                  "to": "simpleBroker",
                  "verb": "수신 session 등록",
                  "payload": "/topic/chat → Browser B only",
                  "kind": "config"
                },
                {
                  "from": "simpleBroker",
                  "to": "subscriptionRegistry",
                  "verb": "topic 구독자 조회",
                  "payload": "/topic/chat",
                  "kind": "call"
                },
                {
                  "from": "subscriptionRegistry",
                  "to": "simpleBroker",
                  "verb": "수신자 반환",
                  "payload": "Browser B session",
                  "kind": "response"
                },
                {
                  "from": "simpleBroker",
                  "to": "browserB",
                  "verb": "구독자 fan-out",
                  "payload": "MESSAGE frame + ChatMessage",
                  "kind": "event",
                  "check": "이 상태는 기본 main 데모가 아니라 별도 client 또는 수정된 페이지로 수동 재현합니다."
                }
              ]
            }
          ],
          "notReached": [
            {
              "label": "Browser A receive",
              "reason": "발신 사실만으로 수신자가 되지 않으며 Browser A session은 /topic/chat을 구독하지 않았습니다."
            }
          ]
        },
        "route": [
          "Browser A",
          "/ws-chat",
          "STOMP CONNECTED",
          "SEND /app/chat.send",
          "WebSocketController",
          "STOMP Broker",
          "/topic/chat"
        ],
        "snapshot": [
          {
            "label": "Browser A subscription",
            "value": "없음",
            "tone": "warning"
          },
          {
            "label": "Server receive",
            "value": "ChatMessage",
            "tone": "signal"
          },
          {
            "label": "Browser A receive",
            "value": "없음",
            "tone": "warning"
          }
        ],
        "evidence": "발신 탭에는 MESSAGE frame이 없고, 이미 구독한 두 번째 탭에서만 payload가 보이는지 확인합니다.",
        "outcome": "send와 receive는 별도 약속이므로 메시지를 받으려는 탭은 topic을 먼저 구독해야 합니다.",
        "fanOut": [
          "두 번째 구독 탭"
        ]
      },
      {
        "id": "origin-rejected",
        "label": "Origin 불일치 · 연결 거절",
        "flowId": "connect-send-receive",
        "tone": "blocked",
        "prompt": "브라우저 Origin이 APP_WEBSOCKET_ALLOWED_ORIGIN_PATTERNS에 포함되지 않은 상태로 연결합니다.",
        "diagram": {
          "caption": "Origin은 STOMP 이전의 HTTP Upgrade 경계에서 검사됩니다. 거절되면 WebSocket transport와 STOMP session이 모두 만들어지지 않습니다.",
          "lanes": [
            {
              "id": "origin-rejection",
              "label": "Handshake rejected",
              "description": "실제 프런트 Origin과 환경 설정의 허용 패턴이 다르면 /ws-chat upgrade 전에 중단됩니다.",
              "steps": [
                {
                  "from": "browserA",
                  "to": "originGate",
                  "verb": "handshake 요청",
                  "payload": "GET Upgrade /ws-chat + disallowed Origin",
                  "kind": "request",
                  "codePointIds": [
                    "websocket-config"
                  ]
                },
                {
                  "from": "originGate",
                  "to": "browserA",
                  "verb": "Origin 불일치 거절",
                  "payload": "no WebSocket upgrade",
                  "kind": "failure",
                  "concept": "Allowed Origin",
                  "check": "STOMP CONNECTED 실패가 아니라 그 이전 transport handshake 실패입니다."
                }
              ]
            }
          ],
          "notReached": [
            {
              "label": "WebSocket endpoint",
              "reason": "허용 Origin 검사를 통과하지 못해 transport session이 생성되지 않습니다."
            },
            {
              "label": "STOMP router · Subscription registry",
              "reason": "WebSocket 연결이 없으므로 CONNECT와 SUBSCRIBE frame을 보낼 수 없습니다."
            },
            {
              "label": "WebSocketController · Simple Broker",
              "reason": "application destination과 topic broadcast에 도달하지 않습니다."
            }
          ]
        },
        "route": [
          "Browser",
          "Origin check",
          "/ws-chat",
          "STOMP CONNECTED",
          "SUBSCRIBE /topic/chat",
          "SEND /app/chat.send",
          "/topic/chat receive"
        ],
        "snapshot": [
          {
            "label": "Allowed origin",
            "value": "불일치",
            "tone": "blocked"
          },
          {
            "label": "WebSocket",
            "value": "연결되지 않음",
            "tone": "blocked"
          },
          {
            "label": "STOMP session",
            "value": "생성되지 않음",
            "tone": "warning"
          }
        ],
        "evidence": "실제 프런트 Origin과 허용 패턴을 비교하고 테스트 페이지에서 연결 실패 상태를 확인합니다.",
        "outcome": "허용할 프런트 Origin을 환경 설정에 명시한 뒤 연결부터 다시 확인해야 합니다.",
        "stopAfter": 1
      }
    ]
  },
  "actors": [
    {
      "id": "browser",
      "label": "Browser Client",
      "kind": "client"
    },
    {
      "id": "endpoint",
      "label": "WebSocket Endpoint",
      "kind": "server"
    },
    {
      "id": "controller",
      "label": "WebSocketController",
      "kind": "server"
    },
    {
      "id": "broker",
      "label": "STOMP Broker",
      "kind": "queue"
    },
    {
      "id": "subscribers",
      "label": "Subscribers",
      "kind": "client"
    }
  ],
  "flows": [
    {
      "id": "connect-send-receive",
      "title": "connect / subscribe / send / receive",
      "summary": "클라이언트가 연결을 만들고 topic을 구독한 뒤 메시지를 보내면 서버가 구독자에게 다시 broadcast합니다.",
      "mermaid": "sequenceDiagram\n  actor ClientA\n  actor ClientB\n  participant WS as WebSocket endpoint\n  participant Broker as STOMP broker\n  participant Controller as WebSocketController\n  ClientA->>WS: connect\n  ClientA->>Broker: subscribe /topic/chat\n  ClientB->>WS: connect\n  ClientB->>Broker: subscribe /topic/chat\n  ClientA->>Controller: send /app/chat.send\n  Controller->>Broker: publish /topic/chat\n  Broker-->>ClientA: message\n  Broker-->>ClientB: message",
      "steps": [
        {
          "order": 1,
          "actor": "Client",
          "input": "Connect request",
          "owner": "WebSocket endpoint",
          "action": "HTTP 요청/응답과 다른 연결을 엽니다.",
          "output": "Open connection",
          "note": "실시간 메시지는 연결이 유지된 상태에서 주고받습니다.",
          "id": "connect-send-receive-step-1",
          "from": "Client",
          "to": "WebSocket endpoint",
          "message": "HTTP 요청/응답과 다른 연결을 엽니다.",
          "messageKind": "request",
          "problem": "Connect request",
          "concept": "WebSocket endpoint",
          "check": "Open connection",
          "codePointIds": [
            "websocket-config",
            "topic-broadcast"
          ]
        },
        {
          "order": 2,
          "actor": "Client",
          "input": "subscribe /topic/chat",
          "owner": "STOMP broker",
          "action": "서버가 publish할 topic을 구독합니다.",
          "output": "Subscription",
          "note": "받는 경로는 `/topic`으로 읽습니다.",
          "id": "connect-send-receive-step-2",
          "from": "Client",
          "to": "STOMP broker",
          "message": "서버가 publish할 topic을 구독합니다.",
          "messageKind": "event",
          "problem": "subscribe /topic/chat",
          "concept": "STOMP broker",
          "check": "Subscription",
          "codePointIds": [
            "topic-broadcast",
            "websocket-config"
          ]
        },
        {
          "order": 3,
          "actor": "Client",
          "input": "send /app/chat.send",
          "owner": "WebSocketController",
          "action": "메시지를 서버 controller로 보냅니다.",
          "output": "ChatMessage",
          "note": "보내는 경로는 `/app`으로 읽습니다.",
          "id": "connect-send-receive-step-3",
          "from": "Client",
          "to": "WebSocketController",
          "message": "메시지를 서버 controller로 보냅니다.",
          "messageKind": "event",
          "problem": "send /app/chat.send",
          "concept": "WebSocketController",
          "check": "ChatMessage",
          "codePointIds": [
            "websocket-config",
            "topic-broadcast"
          ]
        },
        {
          "order": 4,
          "actor": "WebSocketController",
          "input": "ChatMessage",
          "owner": "STOMP broker",
          "action": "topic 구독자에게 메시지를 publish합니다.",
          "output": "Broadcast message",
          "note": "서버가 연결된 여러 클라이언트에게 다시 보냅니다.",
          "id": "connect-send-receive-step-4",
          "from": "WebSocketController",
          "to": "STOMP broker",
          "message": "topic 구독자에게 메시지를 publish합니다.",
          "messageKind": "event",
          "problem": "ChatMessage",
          "concept": "STOMP broker",
          "check": "Broadcast message",
          "codePointIds": [
            "topic-broadcast",
            "websocket-config"
          ]
        },
        {
          "order": 5,
          "actor": "Subscribed clients",
          "input": "Broadcast message",
          "owner": "Browser test page",
          "action": "구독 중인 화면에서 메시지를 받습니다.",
          "output": "Rendered message",
          "note": "브라우저 탭 두 개로 같은 topic 수신을 확인할 수 있습니다.",
          "id": "connect-send-receive-step-5",
          "from": "Subscribed clients",
          "to": "Browser test page",
          "message": "구독 중인 화면에서 메시지를 받습니다.",
          "messageKind": "event",
          "problem": "Broadcast message",
          "concept": "Browser test page",
          "check": "Rendered message",
          "codePointIds": [
            "websocket-config",
            "topic-broadcast"
          ]
        }
      ],
      "bandKind": "scenario"
    },
    {
      "id": "http-vs-websocket",
      "title": "HTTP와 WebSocket 비교",
      "summary": "요청/응답이 맞는 기능은 HTTP로 유지하고, 연결된 화면에 서버가 다시 보내야 하는 흐름은 WebSocket으로 봅니다.",
      "steps": [
        {
          "order": 1,
          "actor": "Client",
          "input": "HTTP GET request",
          "owner": "Controller",
          "action": "요청 하나에 응답 하나를 돌려줍니다.",
          "output": "HTTP response",
          "note": "조회, 로그인, 캐시 조회처럼 요청 단위가 분명한 기능에 잘 맞습니다.",
          "id": "http-vs-websocket-step-1",
          "from": "Client",
          "to": "Controller",
          "message": "요청 하나에 응답 하나를 돌려줍니다.",
          "messageKind": "request",
          "problem": "HTTP GET request",
          "concept": "Controller",
          "check": "HTTP response",
          "codePointIds": [
            "websocket-config",
            "topic-broadcast"
          ]
        },
        {
          "order": 2,
          "actor": "Client",
          "input": "WebSocket connection",
          "owner": "WebSocket endpoint",
          "action": "연결을 유지합니다.",
          "output": "Connected session",
          "note": "서버가 나중에 다시 메시지를 보낼 수 있는 통로입니다.",
          "id": "http-vs-websocket-step-2",
          "from": "Client",
          "to": "WebSocket endpoint",
          "message": "연결을 유지합니다.",
          "messageKind": "event",
          "problem": "WebSocket connection",
          "concept": "WebSocket endpoint",
          "check": "Connected session",
          "codePointIds": [
            "topic-broadcast",
            "websocket-config"
          ]
        },
        {
          "order": 3,
          "actor": "Server",
          "input": "Published message",
          "owner": "Topic",
          "action": "구독 중인 클라이언트에게 메시지를 전달합니다.",
          "output": "Realtime update",
          "note": "HTTP와 WebSocket은 경쟁 관계가 아니라 목적이 다릅니다.",
          "id": "http-vs-websocket-step-3",
          "from": "Server",
          "to": "Topic",
          "message": "구독 중인 클라이언트에게 메시지를 전달합니다.",
          "messageKind": "event",
          "problem": "Published message",
          "concept": "Topic",
          "check": "Realtime update",
          "codePointIds": [
            "websocket-config",
            "topic-broadcast"
          ]
        },
        {
          "id": "http-vs-websocket-check-4",
          "order": 4,
          "actor": "Topic",
          "owner": "확인 지점",
          "from": "Topic",
          "to": "확인 지점",
          "message": "결과와 실패 지점을 확인합니다.",
          "messageKind": "response",
          "problem": "구현 후 실제로 어느 지점이 통과했는지 확인해야 합니다.",
          "concept": "Verification",
          "action": "문서의 확인 명령이나 화면에서 결과를 검증합니다.",
          "check": "성공 흐름과 실패 흐름을 말로 설명합니다.",
          "note": "Visual Lab은 코드를 대신 완성하지 않고 확인 지점을 고정합니다.",
          "codePointIds": [
            "topic-broadcast"
          ]
        }
      ],
      "bandKind": "scenario"
    }
  ],
  "flow": [
    {
      "id": "connect-send-receive-step-1",
      "label": "WebSocket endpoint",
      "problem": "Connect request",
      "concept": "WebSocket endpoint",
      "action": "HTTP 요청/응답과 다른 연결을 엽니다.",
      "check": "Open connection",
      "codePointIds": [
        "websocket-config",
        "topic-broadcast"
      ]
    },
    {
      "id": "connect-send-receive-step-2",
      "label": "STOMP broker",
      "problem": "subscribe /topic/chat",
      "concept": "STOMP broker",
      "action": "서버가 publish할 topic을 구독합니다.",
      "check": "Subscription",
      "codePointIds": [
        "topic-broadcast",
        "websocket-config"
      ]
    },
    {
      "id": "connect-send-receive-step-3",
      "label": "WebSocketController",
      "problem": "send /app/chat.send",
      "concept": "WebSocketController",
      "action": "메시지를 서버 controller로 보냅니다.",
      "check": "ChatMessage",
      "codePointIds": [
        "websocket-config",
        "topic-broadcast"
      ]
    },
    {
      "id": "connect-send-receive-step-4",
      "label": "STOMP broker",
      "problem": "ChatMessage",
      "concept": "STOMP broker",
      "action": "topic 구독자에게 메시지를 publish합니다.",
      "check": "Broadcast message",
      "codePointIds": [
        "topic-broadcast",
        "websocket-config"
      ]
    },
    {
      "id": "connect-send-receive-step-5",
      "label": "Browser test page",
      "problem": "Broadcast message",
      "concept": "Browser test page",
      "action": "구독 중인 화면에서 메시지를 받습니다.",
      "check": "Rendered message",
      "codePointIds": [
        "websocket-config",
        "topic-broadcast"
      ]
    }
  ],
  "codePoints": [
    {
      "id": "websocket-config",
      "title": "STOMP endpoint와 topic broker를 분리합니다",
      "file": "src/main/kotlin/com/andi/rest_crud/config/WebSocketConfig.kt",
      "language": "kotlin",
      "snippet": "override fun configureMessageBroker(registry: MessageBrokerRegistry) {\n    registry.enableSimpleBroker(\"/topic\")\n    registry.setApplicationDestinationPrefixes(\"/app\")\n}\n\noverride fun registerStompEndpoints(registry: StompEndpointRegistry) {\n    registry.addEndpoint(\"/ws-chat\")\n        .setAllowedOriginPatterns(\n            *allowedOriginPatterns.split(\",\").map(String::trim).toTypedArray()\n        )\n}",
      "explanation": "클라이언트는 endpoint에 연결하고, 메시지는 /app과 /topic 역할로 나뉩니다.",
      "check": "connect, subscribe, send 순서를 테스트 페이지에서 지킵니다."
    },
    {
      "id": "topic-broadcast",
      "title": "MessageMapping은 topic broadcast로 이어집니다",
      "file": "src/main/kotlin/com/andi/rest_crud/controller/WebSocketController.kt",
      "language": "kotlin",
      "snippet": "@Controller\nclass WebSocketController {\n\n    @MessageMapping(\"/chat.send\")\n    @SendTo(\"/topic/chat\")\n    fun send(message: ChatMessage): ChatMessage {\n        return message\n    }\n}",
      "explanation": "HTTP 응답이 아니라 구독 중인 클라이언트들에게 메시지를 다시 보냅니다.",
      "check": "구독한 브라우저만 broadcast 메시지를 받는지 확인합니다."
    }
  ],
  "concepts": [
    {
      "title": "WebSocket은 연결을 유지합니다",
      "body": "서버가 나중에 클라이언트에게 다시 보낼 수 있는 통로를 만듭니다."
    },
    {
      "title": "STOMP는 메시지 목적지를 나눕니다",
      "body": "보내는 경로와 구독하는 경로를 명확히 표현합니다."
    },
    {
      "title": "Topic은 받는 쪽의 약속입니다",
      "body": "구독자는 topic에 publish된 메시지를 받습니다."
    },
    {
      "title": "Broadcast는 다시 보내는 흐름입니다",
      "body": "서버가 받은 메시지를 topic 구독자들에게 전달합니다."
    }
  ],
  "practice": [
    "HTTP 요청/응답과 WebSocket 연결 유지 흐름의 차이를 설명할 수 있나요?",
    "`/app`으로 보내고 `/topic`으로 받는 이유를 말할 수 있나요?",
    "서버가 topic 구독자에게 다시 publish하는 순서를 설명할 수 있나요?",
    "이번 시퀀스가 채팅 서비스 전체 구현이 아닌 이유를 설명할 수 있나요?"
  ],
  "mentorHints": [],
  "relatedDocs": [
    {
      "label": "이론 정리",
      "href": "../../../theory.md"
    },
    {
      "label": "구현 안내",
      "href": "../../../implementation.md"
    },
    {
      "label": "체크리스트",
      "href": "../../../checklist.md"
    }
  ],
  "relatedCode": [],
  "topic": "Realtime communication",
  "question": "서버가 클라이언트 요청을 기다리지 않고 연결된 화면에 다시 메시지를 보내려면 무엇이 달라질까?",
  "sourceDocs": [
    {
      "label": "이론 정리",
      "href": "../../../theory.md"
    },
    {
      "label": "구현 안내",
      "href": "../../../implementation.md"
    },
    {
      "label": "체크리스트",
      "href": "../../../checklist.md"
    }
  ],
  "why": {
    "problem": "HTTP는 클라이언트가 요청을 보내고 서버가 응답하는 구조라 채팅이나 알림처럼 서버가 다시 보내는 흐름을 설명하기 어렵습니다.",
    "limits": [
      "클라이언트가 계속 새 요청을 보내는 방식은 실시간 전달 흐름을 이해하기에 한계가 있습니다.",
      "전송 prefix와 구독 topic을 같은 경로로 보면 메시지 방향이 흐려집니다.",
      "채팅방, 메시지 저장, 인증 확장을 한 번에 붙이면 가장 작은 broadcast 흐름이 보이지 않습니다."
    ],
    "choice": "이번 시퀀스에서는 connect, subscribe, send, receive 순서와 `/app` 전송 경로, `/topic` 구독 경로를 먼저 분리합니다."
  },
  "overview": [
    "Client Connect",
    "Handshake",
    "Subscribe /topic",
    "Send /app",
    "Message Controller",
    "Server Publish",
    "Client Receive"
  ],
  "responsibilities": [
    {
      "name": "WebSocketConfig",
      "role": "연결 endpoint, application prefix, broker topic prefix를 설정합니다.",
      "caution": "`/app`과 `/topic`을 같은 의미로 보지 않습니다."
    },
    {
      "name": "WebSocketController",
      "role": "클라이언트가 보낸 STOMP 메시지를 받고 topic으로 돌려보냅니다.",
      "caution": "HTTP Controller와 annotation과 흐름이 다릅니다."
    },
    {
      "name": "Message DTO",
      "role": "실시간 메시지 payload를 표현합니다.",
      "caution": "채팅 저장 모델이나 DB Entity와 같은 책임이 아닙니다."
    },
    {
      "name": "Test page",
      "role": "connect, subscribe, send, receive 순서를 눈으로 확인하는 도구입니다.",
      "caution": "연결 전에 send를 누르면 흐름을 제대로 확인하기 어렵습니다."
    }
  ],
  "glossary": [
    {
      "term": "WebSocket",
      "meaning": "클라이언트와 서버 사이에 유지되는 양방향 연결입니다.",
      "caution": "요청 하나와 응답 하나로 끝나는 HTTP와 다릅니다."
    },
    {
      "term": "STOMP",
      "meaning": "WebSocket 위에서 메시지 목적지와 구독 흐름을 다루는 프로토콜입니다.",
      "caution": "연결 자체와 메시지 경로를 구분해야 합니다."
    },
    {
      "term": "Topic",
      "meaning": "여러 클라이언트가 구독하는 메시지 목적지입니다.",
      "caution": "서버로 보내는 `/app` 경로와 다릅니다."
    },
    {
      "term": "Message DTO",
      "meaning": "실시간 메시지 payload를 담는 객체입니다.",
      "caution": "DB 저장 모델이나 채팅방 모델이 아닙니다."
    },
    {
      "term": "Broadcast",
      "meaning": "서버가 받은 메시지를 구독자들에게 다시 보내는 흐름입니다.",
      "caution": "한 사용자에게만 응답하는 HTTP와 다릅니다."
    }
  ],
  "practical": [
    {
      "title": "가장 작은 broadcast만 봅니다",
      "body": "채팅방 관리, 메시지 저장, 읽음 처리, 인증 확장은 이번 범위를 넘어갑니다."
    },
    {
      "title": "연결 순서가 중요합니다",
      "body": "connect가 끝나기 전에 subscribe나 send를 실행하면 테스트 화면의 결과가 흔들립니다."
    },
    {
      "title": "HTTP를 대체하지 않습니다",
      "body": "요청/응답이 맞는 기능은 HTTP로 유지하고, 서버 push가 필요한 곳에 WebSocket을 씁니다."
    }
  ],
  "checks": [
    "HTTP 요청/응답과 WebSocket 연결 유지 흐름의 차이를 설명할 수 있나요?",
    "`/app`으로 보내고 `/topic`으로 받는 이유를 말할 수 있나요?",
    "서버가 topic 구독자에게 다시 publish하는 순서를 설명할 수 있나요?",
    "이번 시퀀스가 채팅 서비스 전체 구현이 아닌 이유를 설명할 수 있나요?"
  ],
  "next": {
    "id": "09",
    "title": "Docker/Runtime",
    "reason": "실시간 통신까지 확인했다면, 다음에는 애플리케이션을 jar와 Docker image, runtime config로 실행 가능한 단위로 묶는 흐름을 봅니다."
  }
};
