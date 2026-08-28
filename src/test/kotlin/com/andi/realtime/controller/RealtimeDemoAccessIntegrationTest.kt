package com.andi.realtime.controller

import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.core.io.ClassPathResource

class RealtimeDemoAccessIntegrationTest {

    @Test
    fun `실시간 데모 페이지는 두 native client와 읽기 전용 destination 계약을 보여준다`() {
        val html = ClassPathResource("static/realtime-demo.html")
            .inputStream
            .bufferedReader()
            .use { it.readText() }

        assertTrue(html.contains("Client A"))
        assertTrue(html.contains("Client B"))
        assertTrue(html.contains("/ws-chat"))
        assertTrue(html.contains("/app/chat.send"))
        assertTrue(html.contains("/topic/chat"))
        assertTrue(html.contains("new WebSocket"))
        assertFalse(html.contains("SockJS"))
    }
}
