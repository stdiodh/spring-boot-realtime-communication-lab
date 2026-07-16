window.visualLabData = {
  "kind": "sequence",
  "sequence": "08",
  "title": "Realtime WebSocket",
  "subtitle": "Connection, subscription and fan-out",
  "goal": "WebSocket transport와 STOMP messaging을 분리하고, 연결·구독 조건만 보고 실제 메시지 수신자를 예측합니다.",
  "problem": "HTTP 요청이 올 때만 응답하면 서버에서 새로 생긴 메시지를 연결된 화면에 즉시 전달하는 흐름을 설명하기 어렵습니다.",
  "repo": {
    "name": "spring-boot-realtime-communication-lab",
    "path": "spring-boot-realtime-communication-lab"
  },
  "workbench": {
    "kind": "realtime",
    "title": "연결·구독 뒤 메시지가 전달되는 과정",
    "instruction": "transport, STOMP session, topic subscription의 입력 상태를 읽고 누가 MESSAGE를 받을지 먼저 예측하세요.",
    "story": {
      "invariant": "WebSocket 연결은 통로를 열고, STOMP 구독은 그 통로에서 어떤 topic 메시지를 받을지 등록합니다.",
      "scope": "main 데모는 native WebSocket으로 STOMP frame을 직접 주고받고 SUBSCRIBE receipt는 요청하지 않습니다. UI는 구독 frame 전송까지만 알고, 실제 MESSAGE 수신이 등록 동작의 수동 간접 증거입니다."
    },
    "terms": [
      {
        "term": "WebSocket transport",
        "meaning": "/ws-chat에서 열리는 유지 연결입니다. transport가 OPEN이어도 STOMP session 준비와 topic 구독은 아직 별도 상태입니다."
      },
      {
        "term": "STOMP messaging",
        "meaning": "CONNECT, SUBSCRIBE, SEND, MESSAGE frame과 destination 규칙입니다. WebSocket 위에서 동작하지만 연결 자체와 같은 개념이 아닙니다."
      },
      {
        "term": "/app와 /topic",
        "meaning": "/app/chat.send는 서버 handler로 보내는 경로이고 /topic/chat은 broker가 현재 구독자에게 전달하는 경로입니다."
      },
      {
        "term": "Origin과 인증",
        "meaning": "Origin allowlist는 handshake 출처를 제한합니다. 사용자의 신원과 권한을 확인하는 인증·인가는 별도 정책입니다."
      }
    ],
    "visual": {
      "src": "../../assets/diagrams/08-connection-subscription-fanout.svg",
      "alt": "브라우저 A와 B가 /ws-chat WebSocket transport를 열고 STOMP CONNECTED 뒤 /topic/chat SUBSCRIBE frame을 보낸다. Browser A가 /app/chat.send로 보낸 ChatMessage를 두 탭이 실제 MESSAGE로 받으면 topic 등록 동작을 간접 확인한다.",
      "caption": "WebSocket transport, STOMP session, `/topic/chat` subscription, broker fan-out의 위치 관계입니다."
    },
    "comparison": {
      "label": "연결 완료와 구독 요청 전송은 다른 상태입니다",
      "left": {
        "title": "Connected · 통로가 열림",
        "body": "WebSocket OPEN과 STOMP CONNECTED는 frame을 주고받을 session이 준비됐다는 뜻입니다. 특정 topic의 수신자라는 뜻은 아닙니다."
      },
      "right": {
        "title": "SUBSCRIBE frame 전송",
        "body": "main 데모는 destination:/topic/chat 등록을 요청하지만 receipt는 받지 않습니다. 실제 MESSAGE 수신이 동작의 수동 간접 증거입니다."
      }
    },
    "nodes": {
      "browserA": {
        "label": "Browser A",
        "icon": "client",
        "kind": "STOMP client",
        "role": "native WebSocket으로 frame을 보내는 발신 session입니다.",
        "systemLayer": "outside",
        "boundary": "Browser",
        "codePointIds": ["native-demo"]
      },
      "browserB": {
        "label": "Browser B",
        "icon": "client",
        "kind": "STOMP client",
        "role": "같은 topic을 구독할 수 있는 별도 session입니다.",
        "systemLayer": "outside",
        "boundary": "Browser"
      },
      "originGate": {
        "label": "Origin gate",
        "icon": "security",
        "kind": "handshake gate",
        "role": "HTTP Upgrade 전에 브라우저 Origin과 허용 패턴을 비교합니다.",
        "systemLayer": "interface",
        "boundary": "Handshake",
        "codePointIds": ["websocket-config"]
      },
      "websocketEndpoint": {
        "label": "/ws-chat endpoint",
        "icon": "websocket",
        "kind": "transport endpoint",
        "role": "native WebSocket transport를 엽니다.",
        "systemLayer": "interface",
        "boundary": "WebSocket",
        "codePointIds": ["websocket-config"]
      },
      "stompRouter": {
        "label": "STOMP router",
        "icon": "handler",
        "kind": "message router",
        "role": "CONNECT, SUBSCRIBE, SEND destination을 해석합니다.",
        "systemLayer": "interface",
        "boundary": "STOMP"
      },
      "demoUiGuard": {
        "label": "Demo UI guard",
        "icon": "gate",
        "kind": "client guard",
        "role": "CONNECTED 전 send를 비활성화하고 CONNECTED 뒤 자동 구독합니다.",
        "systemLayer": "outside",
        "boundary": "Browser UI",
        "codePointIds": ["native-demo"]
      },
      "webSocketController": {
        "label": "WebSocketController",
        "icon": "api",
        "kind": "message handler",
        "role": "/app/chat.send의 ChatMessage를 받아 /topic/chat 결과를 반환합니다.",
        "systemLayer": "interface",
        "boundary": "Application messaging",
        "codePointIds": ["topic-broadcast"]
      },
      "subscriptionRegistry": {
        "label": "Subscription registry",
        "icon": "broker",
        "kind": "subscription registry",
        "role": "/topic/chat을 구독한 session 집합을 유지합니다.",
        "systemLayer": "integration",
        "boundary": "Broker"
      },
      "simpleBroker": {
        "label": "Simple Broker",
        "icon": "broker",
        "kind": "topic broker",
        "role": "현재 topic 구독자에게 MESSAGE frame을 fan-out합니다.",
        "systemLayer": "integration",
        "boundary": "Broker",
        "codePointIds": ["websocket-config", "topic-broadcast"]
      }
    },
    "scenarios": [
      {
        "id": "two-subscribers",
        "label": "두 탭 CONNECTED · 두 탭 구독",
        "flowId": "message-flow",
        "tone": "recovered",
        "prompt": "Browser A와 B가 각각 STOMP CONNECTED 상태이고 두 session 모두 /topic/chat을 구독했습니다.",
        "observationTitle": "subscription 집합과 fan-out 수신자",
        "theoryRef": "../../../theory.md#seq-08",
        "prediction": {
          "prompt": "Browser A가 /app/chat.send로 ChatMessage를 보내면 어느 탭이 MESSAGE를 받을까요?",
          "options": [
            { "id": "both", "label": "topic을 구독한 Browser A와 B 모두 받는다" },
            { "id": "sender-only", "label": "메시지를 보낸 Browser A만 받는다" },
            { "id": "other-only", "label": "발신자가 아닌 Browser B만 받는다" }
          ],
          "answer": "both",
          "explanation": "broker는 발신자 여부가 아니라 /topic/chat의 현재 subscription 집합을 기준으로 수신자를 선택합니다."
        },
        "diagram": {
          "caption": "Browser A의 SEND가 Controller와 broker를 지나 /topic/chat을 구독한 Browser A와 B 두 session에 MESSAGE로 전달됩니다.",
          "lanes": [
            {
              "id": "two-subscriber-fanout",
              "label": "SEND → handler → 구독자 전달",
              "description": "handler 반환을 broker가 현재 `/topic/chat` subscription에 fan-out합니다.",
              "steps": [
                { "from": "browserA", "to": "stompRouter", "verb": "메시지 발행", "payload": "SEND destination:/app/chat.send · ChatMessage JSON", "kind": "event", "concept": "Application destination", "codePointIds": ["native-demo"], "effect": {"kind":"transfer","subject":"`ChatMessage` SEND frame","before":"Browser A가 `/app/chat.send` destination과 JSON body를 구성함","after":"STOMP router에 SEND frame이 도착함"}, "evidenceScope": "manual" },
                { "from": "stompRouter", "to": "webSocketController", "verb": "handler 라우팅", "payload": "@MessageMapping /chat.send", "kind": "call", "codePointIds": ["topic-broadcast"], "effect": {"kind":"transfer","subject":"application message","before":"STOMP router가 `/app` prefix를 제거해 `/chat.send`를 찾음","after":"`WebSocketController.send`에 `ChatMessage`가 전달됨"}, "evidenceScope": "code" },
                { "from": "webSocketController", "to": "simpleBroker", "verb": "topic 결과 발행", "payload": "@SendTo /topic/chat · ChatMessage", "kind": "event", "concept": "Broker destination", "effect": {"kind":"transfer","subject":"topic message","before":"Controller가 처리한 `ChatMessage`를 반환함","after":"simple broker에 `/topic/chat` message가 전달됨"}, "evidenceScope": "code" },
                { "from": "simpleBroker", "to": "subscriptionRegistry", "verb": "현재 구독자 조회", "payload": "/topic/chat", "kind": "call", "effect": {"kind":"verify","subject":"`/topic/chat` subscription registry","before":"simple broker는 이번 MESSAGE의 수신 session을 아직 정하지 않음","after":"broker의 구독 규칙이 `/topic/chat`에 등록된 session을 수신 후보로 선택함"}, "evidenceScope": "concept" },
                { "from": "subscriptionRegistry", "to": "simpleBroker", "verb": "수신 session 반환", "payload": "Browser A + Browser B", "kind": "response", "concept": "구독자가 수신자를 결정합니다.", "effect": {"kind":"return","subject":"topic 수신 session","before":"개념상 registry에 A와 B의 `/topic/chat` subscription이 있음","after":"fan-out 대상은 연결 전체가 아니라 두 구독 session으로 설명됨"}, "evidenceScope": "concept" },
                { "from": "simpleBroker", "to": "browserA", "verb": "구독자 전달", "payload": "MESSAGE frame · ChatMessage", "kind": "event", "effect": {"kind":"fanout","subject":"`ChatMessage` MESSAGE frame","before":"simple broker에 topic message와 수신 session 목록이 있음","after":"Browser A의 구독 session에 MESSAGE frame이 전달됨"}, "evidenceScope": "manual" },
                { "from": "simpleBroker", "to": "browserB", "verb": "구독자 전달", "payload": "MESSAGE frame · ChatMessage", "kind": "event", "check": "페이지에는 parsed sender/content가 보이고 raw MESSAGE frame은 DevTools에서 확인합니다.", "effect": {"kind":"fanout","subject":"`ChatMessage` MESSAGE frame","before":"simple broker에 topic message와 수신 session 목록이 있음","after":"Browser B의 구독 session에 MESSAGE frame이 전달됨"}, "evidenceScope": "manual" }
              ]
            }
          ]
        },
        "route": ["Browser A", "STOMP router", "WebSocketController", "Simple Broker", "Subscription registry", "Browser A", "Browser B"],
        "snapshot": [
          { "label": "Transport", "value": "A·B WebSocket OPEN", "tone": "recovered" },
          { "label": "Subscription", "value": "A·B /topic/chat", "tone": "signal" },
          { "label": "수신자", "value": "A + B", "tone": "recovered" }
        ],
        "fanOut": ["Browser A", "Browser B"],
        "evidenceType": "브라우저 수동 왕복 · 자동 테스트는 페이지 접근만",
        "evidence": "두 데모 탭은 parsed message를, DevTools는 raw MESSAGE frame을 보여줍니다. 자동 테스트는 이 왕복을 증명하지 않습니다.",
        "outcome": "연결된 탭 전체가 아니라 해당 topic을 구독한 session 집합이 fan-out 수신자입니다.",
        "reflection": {
          "prompt": "세 번째 탭이 CONNECTED만 되고 구독하지 않았다면 왜 받지 못하는지 적어보세요.",
          "hint": "연결 여부가 아니라 `/topic/chat` subscription 등록 여부를 주어로 쓰세요."
        }
      },
      {
        "id": "transport-open-session-pending",
        "label": "WebSocket OPEN · STOMP 응답 전",
        "flowId": "session-flow",
        "tone": "blocked",
        "prompt": "WebSocket open event는 발생했지만 아직 STOMP CONNECTED frame을 받지 못했습니다.",
        "observationTitle": "OPEN과 STOMP 준비 상태 구분",
        "theoryRef": "../../../theory.md#seq-08",
        "prediction": {
          "prompt": "이 상태에서 main 데모의 Send 버튼과 /topic/chat 구독은 어떻게 될까요?",
          "options": [
            { "id": "guarded", "label": "Send는 비활성이고 CONNECTED 뒤에야 자동 구독한다" },
            { "id": "ready", "label": "WebSocket OPEN만으로 Send와 topic 수신이 모두 준비된다" },
            { "id": "auto-message", "label": "서버가 CONNECTED 전에 MESSAGE를 먼저 보낸다" }
          ],
          "answer": "guarded",
          "explanation": "transport OPEN은 STOMP session 준비 완료가 아닙니다. main 데모는 CONNECTED를 받은 뒤 SUBSCRIBE를 보내고 Send를 활성화합니다."
        },
        "diagram": {
          "caption": "Origin 검사를 통과해 WebSocket은 열렸지만 STOMP CONNECTED 전이라 main 데모의 UI guard가 SEND를 서버로 보내지 않습니다.",
          "lanes": [
            {
              "id": "session-pending-path",
              "label": "handshake → OPEN → CONNECT 대기",
              "description": "WebSocket transport와 STOMP session 준비를 분리합니다.",
              "steps": [
                { "from": "browserA", "to": "originGate", "verb": "handshake 요청", "payload": "GET Upgrade /ws-chat · Origin", "kind": "request", "codePointIds": ["websocket-config"], "effect": {"kind":"transfer","subject":"WebSocket Upgrade 요청","before":"Browser A가 `/ws-chat`과 Origin header를 구성함","after":"Origin gate에 HTTP Upgrade 요청이 도착함"}, "evidenceScope": "manual" },
                { "from": "originGate", "to": "websocketEndpoint", "verb": "Origin 허용", "payload": "WebSocket upgrade", "kind": "call", "concept": "출처 검사는 인증이 아닙니다.", "effect": {"kind":"gate","subject":"Origin allowlist","before":"요청 Origin과 허용 패턴의 일치 여부가 정해지지 않음","after":"허용 패턴과 일치해 `/ws-chat` handshake가 계속됨"}, "evidenceScope": "code" },
                { "from": "websocketEndpoint", "to": "browserA", "verb": "transport 열기", "payload": "WebSocket OPEN", "kind": "response", "concept": "Transport ready", "effect": {"kind":"transform","subject":"WebSocket transport","before":"HTTP Upgrade가 성공했지만 STOMP session은 없음","after":"Browser A의 transport가 `OPEN` 상태가 됨"}, "evidenceScope": "manual" },
                { "from": "browserA", "to": "stompRouter", "verb": "session 요청", "payload": "CONNECT frame · CONNECTED 대기", "kind": "event", "effect": {"kind":"transfer","subject":"STOMP `CONNECT` frame","before":"WebSocket은 OPEN이지만 messaging session은 아직 없음","after":"STOMP router에 `CONNECT` frame이 도착함"}, "evidenceScope": "manual" },
                { "from": "browserA", "to": "demoUiGuard", "verb": "조기 SEND 시도", "payload": "state != CONNECTED", "kind": "call", "codePointIds": ["native-demo"], "effect": {"kind":"verify","subject":"Send 가능 상태","before":"WebSocket은 OPEN이지만 `CONNECTED` frame은 오지 않음","after":"UI guard가 `state != CONNECTED`를 확인해 SEND를 실행하지 않음"}, "evidenceScope": "code" },
                { "from": "demoUiGuard", "to": "browserA", "verb": "조작 차단", "payload": "sendButton disabled", "kind": "failure", "check": "main 데모에서는 CONNECTED 전 SEND frame이 서버에 도달하지 않습니다.", "effect": {"kind":"gate","subject":"Send 버튼","before":"STOMP session이 준비되지 않아 Send 버튼이 disabled임","after":"SEND frame 없이 버튼이 disabled 상태로 유지됨"}, "evidenceScope": "code" }
              ]
            }
          ],
          "notReached": [
            { "label": "Subscription registry", "reason": "CONNECTED 처리 뒤 자동 SUBSCRIBE가 아직 실행되지 않았습니다." },
            { "label": "WebSocketController · Simple Broker", "reason": "UI guard가 SEND를 막아 application destination과 topic에 도달하지 않습니다." }
          ]
        },
        "route": ["Browser A", "Origin gate", "/ws-chat", "Browser A", "STOMP router", "Demo UI guard"],
        "snapshot": [
          { "label": "WebSocket", "value": "OPEN", "tone": "recovered" },
          { "label": "STOMP", "value": "CONNECTED 대기", "tone": "warning" },
          { "label": "Send", "value": "UI에서 비활성", "tone": "blocked" }
        ],
        "evidenceType": "main 데모 UI 코드 · 브라우저 수동 상태 확인",
        "evidence": "데모 코드는 CONNECTED 처리 뒤 SUBSCRIBE와 Send 활성화를 실행합니다. 브라우저 상태 문구와 버튼 상태는 수동 증거입니다.",
        "outcome": "WebSocket OPEN, STOMP CONNECTED, SUBSCRIBE frame 전송, 실제 MESSAGE 수신은 서로 다른 관찰 상태입니다.",
        "reflection": {
          "prompt": "Send 버튼이 비활성일 때 OPEN과 CONNECTED 중 무엇을 먼저 확인할지 적어보세요.",
          "hint": "transport가 열려도 CONNECTED frame 전에는 messaging session이 준비되지 않습니다."
        }
      },
      {
        "id": "only-b-subscribed",
        "label": "두 탭 CONNECTED · B만 구독",
        "flowId": "message-flow",
        "tone": "warning",
        "prompt": "Browser A와 B는 연결됐지만 /topic/chat subscription은 Browser B session에만 있습니다.",
        "observationTitle": "발신자와 구독자가 다른 수신 경로",
        "theoryRef": "../../../theory.md#seq-08",
        "prediction": {
          "prompt": "구독하지 않은 Browser A가 SEND하면 어느 탭이 MESSAGE를 받을까요?",
          "options": [
            { "id": "b-only", "label": "유일한 구독 session인 Browser B만 받는다" },
            { "id": "a-only", "label": "발신자인 Browser A만 받는다" },
            { "id": "both-connected", "label": "연결된 Browser A와 B 모두 받는다" }
          ],
          "answer": "b-only",
          "explanation": "SEND 경로와 RECEIVE subscription은 별도 계약입니다. broker는 /topic/chat에 등록된 Browser B만 선택합니다."
        },
        "diagram": {
          "caption": "Browser A가 메시지를 보내도 /topic/chat을 구독한 session은 Browser B뿐이므로 broker는 B에게만 MESSAGE를 전달합니다.",
          "lanes": [
            {
              "id": "subscriber-b-path",
              "label": "A가 발행 → 구독한 B가 수신",
              "description": "SEND 주체와 topic 수신자를 서로 다른 책임으로 비교합니다.",
              "steps": [
                { "from": "browserB", "to": "subscriptionRegistry", "verb": "topic 등록 요청", "payload": "SUBSCRIBE destination:/topic/chat", "kind": "event", "concept": "Browser B만 frame 전송", "effect": {"kind":"transfer","subject":"Browser B SUBSCRIBE frame","before":"Browser B가 아직 `/topic/chat` 등록 frame을 보내지 않음","after":"Browser B가 SUBSCRIBE frame을 전송했지만 receipt가 없어 registry 반영은 직접 확인되지 않음"}, "evidenceScope": "concept" },
                { "from": "browserA", "to": "stompRouter", "verb": "구독 없이 발행", "payload": "SEND /app/chat.send · ChatMessage", "kind": "event", "effect": {"kind":"transfer","subject":"구독 없는 SEND frame","before":"Browser A는 `/topic/chat` subscription 없이 메시지만 구성함","after":"STOMP router에 `/app/chat.send` SEND frame이 도착함"}, "evidenceScope": "manual" },
                { "from": "stompRouter", "to": "webSocketController", "verb": "handler 라우팅", "payload": "@MessageMapping /chat.send", "kind": "call", "codePointIds": ["topic-broadcast"], "effect": {"kind":"transfer","subject":"application message","before":"STOMP router가 `/app` prefix를 제거해 `/chat.send`를 찾음","after":"`WebSocketController.send`에 `ChatMessage`가 전달됨"}, "evidenceScope": "code" },
                { "from": "webSocketController", "to": "simpleBroker", "verb": "topic 결과 발행", "payload": "@SendTo /topic/chat", "kind": "event", "effect": {"kind":"transfer","subject":"topic message","before":"Controller가 처리한 `ChatMessage`를 반환함","after":"simple broker에 `/topic/chat` message가 전달됨"}, "evidenceScope": "code" },
                { "from": "simpleBroker", "to": "subscriptionRegistry", "verb": "현재 구독자 조회", "payload": "/topic/chat", "kind": "call", "effect": {"kind":"verify","subject":"`/topic/chat` subscription registry","before":"simple broker는 이번 MESSAGE의 수신 session을 아직 정하지 않음","after":"broker의 구독 규칙이 `/topic/chat`에 등록된 session을 수신 후보로 선택함"}, "evidenceScope": "concept" },
                { "from": "subscriptionRegistry", "to": "simpleBroker", "verb": "수신 session 반환", "payload": "Browser B only", "kind": "response", "effect": {"kind":"return","subject":"topic 수신 session","before":"사고 실험상 registry에는 Browser B subscription만 있음","after":"fan-out 대상은 발신자가 아니라 B 구독 session 하나로 설명됨"}, "evidenceScope": "concept" },
                { "from": "simpleBroker", "to": "browserB", "verb": "구독자 전달", "payload": "MESSAGE frame · ChatMessage", "kind": "event", "check": "현재 main 데모는 CONNECTED 뒤 자동 구독하므로 수정 없는 기본 UI로는 이 상태를 만들 수 없습니다.", "effect": {"kind":"fanout","subject":"`ChatMessage` MESSAGE frame","before":"simple broker에 topic message와 수신 session 목록이 있음","after":"Browser B의 구독 session에 MESSAGE frame이 전달됨"}, "evidenceScope": "manual" }
              ]
            }
          ],
          "notReached": [
            { "label": "Browser A receive", "reason": "Browser A session은 /topic/chat subscription registry에 등록되지 않았습니다." }
          ]
        },
        "route": ["Browser B", "Subscription registry", "Browser A", "STOMP router", "WebSocketController", "Simple Broker", "Browser B"],
        "snapshot": [
          { "label": "연결 session", "value": "A + B", "tone": "recovered" },
          { "label": "topic 구독", "value": "B only", "tone": "warning" },
          { "label": "MESSAGE 수신", "value": "B only", "tone": "signal" }
        ],
        "fanOut": ["Browser B"],
        "evidenceType": "개념 비교 · 별도 client 수동 실험",
        "evidence": "이 조건은 CONNECTED와 subscription을 분리한 사고 실험입니다. main 데모는 CONNECTED 뒤 자동 구독하므로 기본 페이지에서 그대로 재현되지는 않습니다.",
        "outcome": "연결은 메시지를 보낼 통로를 주지만 특정 topic의 실제 수신자 등록은 subscription이 결정합니다.",
        "reflection": {
          "prompt": "왜 발신자 A가 자신의 메시지를 받지 못하는지 subscription을 주어로 적어보세요.",
          "hint": "발신자보다 subscription registry에 등록된 session을 먼저 보세요."
        }
      },
      {
        "id": "origin-mismatch",
        "label": "브라우저 Origin · 허용 패턴 불일치",
        "flowId": "session-flow",
        "tone": "blocked",
        "prompt": "브라우저가 보낸 Origin이 APP_WEBSOCKET_ALLOWED_ORIGIN_PATTERNS와 일치하지 않습니다.",
        "observationTitle": "Origin 불일치가 막는 transport 경계",
        "theoryRef": "../../../theory.md#seq-08",
        "prediction": {
          "prompt": "Origin이 허용되지 않으면 STOMP CONNECTED와 사용자 인증은 어떻게 될까요?",
          "options": [
            { "id": "handshake-stop", "label": "WebSocket handshake에서 멈춰 STOMP session 자체가 생기지 않는다" },
            { "id": "auth-fail", "label": "WebSocket은 연결되고 사용자 비밀번호 인증만 실패한다" },
            { "id": "topic-only", "label": "연결과 SEND는 되고 topic 구독만 거부된다" }
          ],
          "answer": "handshake-stop",
          "explanation": "Origin 검사는 WebSocket transport를 열기 전 handshake 조건입니다. 사용자 신원을 검사하는 인증 실패와 같은 사건이 아닙니다."
        },
        "diagram": {
          "caption": "허용 패턴과 다른 Origin은 handshake에서 거부되어 /ws-chat transport, STOMP CONNECTED, subscription, broadcast에 도달하지 않습니다.",
          "lanes": [
            {
              "id": "origin-rejected-path",
              "label": "Origin 불일치 → handshake 거부",
              "description": "WebSocket transport 생성 전에 Origin gate를 판정합니다.",
              "steps": [
                { "from": "browserA", "to": "originGate", "verb": "handshake 요청", "payload": "GET Upgrade /ws-chat · disallowed Origin", "kind": "request", "codePointIds": ["websocket-config"], "effect": {"kind":"transfer","subject":"WebSocket Upgrade 요청","before":"Browser A가 `/ws-chat`과 Origin header를 구성함","after":"Origin gate에 HTTP Upgrade 요청이 도착함"}, "evidenceScope": "manual" },
                { "from": "originGate", "to": "browserA", "verb": "transport 거부", "payload": "WebSocket connection error", "kind": "failure", "concept": "Origin allowlist ≠ authentication", "check": "실제 브라우저 Origin과 환경 설정 값을 비교합니다.", "effect": {"kind":"gate","subject":"WebSocket transport","before":"Upgrade Origin이 허용 패턴과 일치하지 않음","after":"handshake가 중단되어 WebSocket과 STOMP session이 생성되지 않음"}, "evidenceScope": "manual" }
              ]
            }
          ],
          "notReached": [
            { "label": "/ws-chat WebSocket session", "reason": "허용 Origin 검사를 통과하지 못해 transport가 생성되지 않습니다." },
            { "label": "STOMP router · Subscription registry", "reason": "WebSocket 연결이 없어 CONNECT와 SUBSCRIBE frame을 보낼 수 없습니다." },
            { "label": "WebSocketController · Simple Broker", "reason": "application destination과 topic broadcast에 도달하지 않습니다." }
          ]
        },
        "route": ["Browser A", "Origin gate"],
        "snapshot": [
          { "label": "Origin", "value": "허용 패턴 불일치", "tone": "blocked" },
          { "label": "WebSocket", "value": "연결되지 않음", "tone": "blocked" },
          { "label": "STOMP session", "value": "생성되지 않음", "tone": "warning" }
        ],
        "stopAfter": 1,
        "evidenceType": "설정 코드 + 브라우저 연결 상태 수동 확인",
        "evidence": "allowedOriginPatterns와 브라우저 Origin, 연결 오류를 함께 확인합니다. 이 증거는 사용자 인증 여부를 설명하지 않습니다.",
        "outcome": "Origin 불일치는 transport를 막을 뿐 사용자 인증 실패를 뜻하지 않습니다.",
        "reflection": {
          "prompt": "Origin 검사와 사용자 인증이 답하는 질문을 각각 적어보세요.",
          "hint": "Origin은 출처, 인증은 사용자 신원을 확인합니다."
        }
      }
    ]
  },
  "actors": [
    { "id": "browser", "label": "Browser client", "kind": "client" },
    { "id": "transport", "label": "WebSocket transport", "kind": "server" },
    { "id": "router", "label": "STOMP router", "kind": "server" },
    { "id": "broker", "label": "Simple Broker", "kind": "queue" },
    { "id": "subscriber", "label": "Topic 수신 session", "kind": "client" }
  ],
  "flows": [
    {
      "id": "session-flow",
      "title": "transport와 STOMP session 준비",
      "summary": "Origin handshake, WebSocket OPEN, STOMP CONNECTED, SUBSCRIBE는 서로 다른 완료 조건입니다.",
      "steps": [
        { "id": "session-1", "from": "Browser", "to": "Origin gate", "problem": "transport를 열기 전 출처 조건을 확인합니다.", "concept": "Origin allowlist", "action": "HTTP Upgrade와 Origin을 비교합니다.", "check": "허용 패턴과 실제 Origin을 비교합니다.", "codePointIds": ["websocket-config"] },
        { "id": "session-2", "from": "Origin gate", "to": "/ws-chat", "problem": "허용 조건을 통과해야 연결이 생깁니다.", "concept": "WebSocket handshake", "action": "native WebSocket transport를 엽니다.", "check": "브라우저 open/close/error 상태를 확인합니다." },
        { "id": "session-3", "from": "Browser", "to": "STOMP router", "problem": "OPEN만으로 messaging 준비가 끝나지 않습니다.", "concept": "STOMP CONNECT", "action": "CONNECT frame을 보냅니다.", "check": "CONNECTED frame을 받았는지 확인합니다.", "codePointIds": ["native-demo"] },
        { "id": "session-4", "from": "Browser", "to": "Subscription registry", "problem": "특정 topic 수신자를 등록해야 합니다.", "concept": "Subscription", "action": "SUBSCRIBE /topic/chat을 보냅니다.", "check": "main 데모는 CONNECTED 뒤 자동 구독합니다." },
        { "id": "session-5", "from": "Subscription registry", "to": "Broker", "problem": "broker가 수신자 집합을 알아야 합니다.", "concept": "Fan-out membership", "action": "현재 topic session 집합을 유지합니다.", "check": "연결과 구독을 같은 상태로 보지 않습니다." }
      ]
    },
    {
      "id": "message-flow",
      "title": "application send와 topic receive",
      "summary": "/app destination은 handler로, /topic destination은 현재 구독 session으로 이어집니다.",
      "steps": [
        { "id": "message-1", "from": "Browser", "to": "STOMP router", "problem": "메시지를 서버 handler로 보냅니다.", "concept": "SEND", "action": "/app/chat.send와 ChatMessage를 전송합니다.", "check": "publish destination을 /topic과 혼동하지 않습니다.", "codePointIds": ["native-demo"] },
        { "id": "message-2", "from": "STOMP router", "to": "WebSocketController", "problem": "application prefix가 handler를 선택합니다.", "concept": "@MessageMapping", "action": "/chat.send method를 호출합니다.", "check": "ChatMessage body 모양을 확인합니다.", "codePointIds": ["topic-broadcast"] },
        { "id": "message-3", "from": "WebSocketController", "to": "Simple Broker", "problem": "결과를 구독 경로로 보냅니다.", "concept": "@SendTo", "action": "/topic/chat으로 publish합니다.", "check": "/app과 /topic 역할을 분리합니다." },
        { "id": "message-4", "from": "Simple Broker", "to": "Subscription registry", "problem": "현재 수신자를 선택합니다.", "concept": "Subscription", "action": "/topic/chat session 집합을 조회합니다.", "check": "발신자보다 구독 여부를 확인합니다." },
        { "id": "message-5", "from": "Simple Broker", "to": "Topic 수신 sessions", "problem": "현재 구독자에게 결과를 전달합니다.", "concept": "MESSAGE fan-out", "action": "MESSAGE frame을 각 session에 보냅니다.", "check": "화면의 parsed message와 DevTools raw frame을 구분합니다." }
      ]
    }
  ],
  "codePoints": [
    {
      "id": "websocket-config",
      "title": "transport endpoint와 STOMP destination prefix를 분리합니다",
      "file": "src/main/kotlin/com/andi/rest_crud/config/WebSocketConfig.kt",
      "language": "kotlin",
      "snippet": "override fun configureMessageBroker(registry: MessageBrokerRegistry) {\n    registry.enableSimpleBroker(\"/topic\")\n    registry.setApplicationDestinationPrefixes(\"/app\")\n}\n\noverride fun registerStompEndpoints(registry: StompEndpointRegistry) {\n    registry.addEndpoint(\"/ws-chat\")\n        .setAllowedOriginPatterns(*allowedOriginPatterns.split(\",\").map(String::trim).toTypedArray())\n}",
      "explanation": "/ws-chat은 WebSocket transport, /app은 handler 입력, /topic은 broker 출력입니다. Origin 설정은 사용자 인증을 뜻하지 않습니다.",
      "check": "세 주소의 역할을 transport·send·receive로 각각 설명합니다."
    },
    {
      "id": "topic-broadcast",
      "title": "handler 결과가 topic으로 이어집니다",
      "file": "src/main/kotlin/com/andi/rest_crud/controller/WebSocketController.kt",
      "language": "kotlin",
      "snippet": "@Controller\nclass WebSocketController {\n    @MessageMapping(\"/chat.send\")\n    @SendTo(\"/topic/chat\")\n    fun send(message: ChatMessage): ChatMessage {\n        return message\n    }\n}",
      "explanation": "Controller는 ChatMessage를 반환해 broker destination으로 보냅니다. 실제 어느 탭이 받는지는 현재 subscription 집합이 결정합니다.",
      "check": "구독한 브라우저 session만 MESSAGE를 받는지 수동 확인합니다."
    },
    {
      "id": "native-demo",
      "title": "main 데모는 CONNECTED 뒤 SUBSCRIBE frame을 보내고 Send를 엽니다",
      "file": "src/main/resources/static/realtime-demo.html",
      "language": "javascript",
      "snippet": "if (frame.startsWith(\"CONNECTED\")) {\n  sendFrame(\"SUBSCRIBE\", { id: \"chat-subscription\", destination: \"/topic/chat\" });\n  sendButton.disabled = false;\n  appendMessage(\"Subscribed to /topic/chat\");\n  return;\n}",
      "explanation": "native WebSocket 데모의 실제 handler입니다. 화면의 `Subscribed` 문구는 receipt 없이 client가 붙인 낙관적 label이며 registry 완료 증거가 아닙니다.",
      "check": "CONNECTED 뒤 frame 전송과 실제 MESSAGE 수신을 서로 다른 수동 증거로 확인합니다."
    }
  ],
  "concepts": [
    { "title": "Transport와 messaging", "body": "WebSocket은 연결 통로이고 STOMP는 그 통로 위의 frame과 destination 규칙입니다." },
    { "title": "Subscription fan-out", "body": "broker는 연결된 전체 client가 아니라 topic에 등록된 session에게 MESSAGE를 전달합니다." }
  ],
  "responsibilities": [
    { "name": "WebSocketConfig", "role": "endpoint, Origin, application prefix, broker prefix를 설정합니다.", "caution": "Origin 허용을 사용자 인증으로 해석하지 않습니다." },
    { "name": "WebSocketController", "role": "application destination의 message를 받아 topic 결과를 반환합니다.", "caution": "HTTP request/response Controller와 같은 수명주기로 보지 않습니다." }
  ],
  "glossary": [
    { "term": "CONNECTED", "meaning": "STOMP session 준비가 끝났다는 server frame입니다.", "caution": "특정 topic 구독까지 완료됐다는 뜻은 아닙니다." },
    { "term": "SUBSCRIBE", "meaning": "session을 특정 destination 수신자로 등록하는 frame입니다.", "caution": "WebSocket 연결과 별도입니다." },
    { "term": "Fan-out", "meaning": "broker가 하나의 message를 현재 여러 구독 session에 전달하는 동작입니다.", "caution": "발신자나 모든 연결을 자동 포함하지 않습니다." }
  ],
  "practical": [
    { "title": "자동 테스트의 상한", "body": "현재 자동 테스트는 데모 페이지 접근만 확인합니다. STOMP roundtrip은 브라우저 수동 증거입니다." },
    { "title": "실습용 공개 범위", "body": "데모와 /ws-chat의 permitAll은 실습용입니다. 인증, 권한, 저장, 재연결은 별도 개선 범위입니다." }
  ],
  "checks": [
    "WebSocket transport OPEN과 STOMP CONNECTED의 차이를 설명할 수 있나요?",
    "CONNECTED와 /topic/chat SUBSCRIBE frame 전송, 실제 MESSAGE 수신의 차이를 설명할 수 있나요?",
    "/ws-chat, /app/chat.send, /topic/chat의 역할을 각각 설명할 수 있나요?",
    "Origin allowlist가 사용자 인증을 대신하지 않는 이유를 설명할 수 있나요?"
  ],
  "source": {
    "theory": "../../../theory.md",
    "implementation": "../../../implementation.md",
    "checklist": "../../../checklist.md"
  },
  "question": "연결된 탭과 실제 topic 수신자를 같은 집합으로 봐도 될까?",
  "next": {
    "id": "09",
    "title": "Docker/Runtime",
    "reason": "연결과 구독의 경계를 추적했다면, 다음에는 애플리케이션이 어떤 artifact와 runtime 설정으로 실제 실행되는지 추적합니다."
  }
};
