package com.andi.rest_crud.controller

import com.andi.rest_crud.dto.ChatMessage
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller

@Controller
class WebSocketController {

    // TODO 1. 클라이언트가 보낸 메시지를 MessageMapping 경로에서 받으세요.
    // TODO 2. 받은 메시지를 topic 경로로 다시 보내세요.
    // TODO 3. 메시지를 DB에 저장하는 것까지 확장하지 마세요.
    @MessageMapping("/chat.send")
    @SendTo("/topic/chat")
    fun send(message: ChatMessage): ChatMessage {
        TODO("메시지 수신과 broadcast 흐름을 완성하세요.")
    }
}
