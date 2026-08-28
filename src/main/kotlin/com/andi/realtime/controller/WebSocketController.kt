package com.andi.realtime.controller

import com.andi.realtime.dto.ChatMessage
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller

@Controller
class WebSocketController {

    @MessageMapping("/chat.send")
    @SendTo("/topic/chat")
    fun send(message: ChatMessage): ChatMessage = message
}
