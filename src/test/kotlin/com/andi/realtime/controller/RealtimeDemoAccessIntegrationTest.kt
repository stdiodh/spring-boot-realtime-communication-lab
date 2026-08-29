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

    @Test
    fun `OpenAPI 문서는 실제 STOMP 경로와 메시지 payload를 설명한다`() {
        val specification = ClassPathResource("static/openapi/realtime.yaml")
            .inputStream
            .bufferedReader()
            .use { it.readText() }

        assertTrue(specification.contains("openapi: 3.1.0"))
        assertTrue(specification.contains("/ws-chat:"))
        assertTrue(specification.contains("/app/chat.send:"))
        assertTrue(specification.contains("/topic/chat:"))
        assertTrue(specification.contains("sender:"))
        assertTrue(specification.contains("content:"))
    }

    @Test
    fun `Swagger UI는 정적 OpenAPI 문서를 읽기 전용으로 연다`() {
        val configuration = ClassPathResource("application.yaml")
            .inputStream
            .bufferedReader()
            .use { it.readText() }

        assertTrue(configuration.contains("path: /swagger"))
        assertTrue(configuration.contains("url: /openapi/realtime.yaml"))
        assertTrue(configuration.contains("disable-swagger-default-url: true"))
        assertTrue(configuration.contains("supported-submit-methods: []"))
    }
}
