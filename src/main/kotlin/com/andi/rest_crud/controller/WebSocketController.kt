package com.andi.rest_crud.controller

import com.andi.rest_crud.dto.ChatMessage
import org.springframework.stereotype.Controller

@Controller
class WebSocketController {

    fun send(message: ChatMessage): ChatMessage {
        // TODO 3: `/chat.send` 메시지를 받아 `/topic/chat`으로 broadcast하고 message를 반환하세요.
        throw NotImplementedError("메시지 handler와 broadcast를 완성하세요.")
    }
}
