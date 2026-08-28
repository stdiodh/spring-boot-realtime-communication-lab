package com.andi.rest_crud.controller

import com.andi.rest_crud.dto.ChatMessage
import org.junit.jupiter.api.Assertions.assertSame
import org.junit.jupiter.api.Test

class WebSocketControllerTest {
    private val controller = WebSocketController()

    @Test
    fun `send는 받은 메시지를 topic broadcast 결과로 그대로 반환한다`() {
        val message = ChatMessage("client-a", "hello websocket")

        val result = controller.send(message)

        assertSame(message, result)
    }
}
