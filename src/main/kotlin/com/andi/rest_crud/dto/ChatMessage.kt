package com.andi.rest_crud.dto

// TODO 1. 이번 시퀀스에서는 sender와 content 두 값만으로도 실시간 흐름을 충분히 볼 수 있습니다.
// TODO 2. 채팅방, 읽음 처리, 저장용 필드를 한 번에 늘리지 마세요.
data class ChatMessage(
    val sender: String,
    val content: String
)
