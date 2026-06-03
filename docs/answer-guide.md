# 참고 구현 안내

이 starter 브랜치에는 참고 구현 코드나 비교 브랜치 안내를 포함하지 않습니다.

실습 중에는 아래 문서를 기준으로 직접 구현 흐름을 확인합니다.

- [이론 정리](./theory.md)
- [구현 가이드](./implementation.md)
- [체크리스트](./checklist.md)

## 구현 전에 확인할 질문

- `ChatMessage`는 어떤 값을 담아야 실시간 메시지 흐름을 설명할 수 있나요?
- `WebSocketConfig`에서 연결 endpoint, 전송 prefix, topic prefix는 각각 무엇을 의미하나요?
- `WebSocketController`는 클라이언트가 보낸 메시지를 어디에서 받나요?
- 테스트 페이지에서 connect, send, receive는 어떤 순서로 일어나나요?

## 멘토 안내

참고 구현 비교는 수업 운영 단계에서만 별도로 다룹니다. starter 브랜치에서는 비교용 코드, 비교 브랜치명, 완성 흐름 해설을 노출하지 않습니다.
