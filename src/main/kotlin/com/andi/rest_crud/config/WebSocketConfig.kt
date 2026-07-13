package com.andi.rest_crud.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer

@Configuration
@EnableWebSocketMessageBroker
class WebSocketConfig(
    @Value("\${app.websocket-allowed-origin-patterns:http://localhost:*}")
    private val allowedOriginPatterns: String
) : WebSocketMessageBrokerConfigurer {

    override fun configureMessageBroker(registry: MessageBrokerRegistry) {
        // TODO 1. 클라이언트가 구독할 topic prefix를 먼저 확인하세요.
        // TODO 2. 클라이언트가 서버로 보낼 경로 prefix도 함께 확인하세요.
        registry.enableSimpleBroker("/topic")
        registry.setApplicationDestinationPrefixes("/app")
    }

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        // TODO 3. 테스트 페이지가 연결할 endpoint를 확인하세요.
        // TODO 4. 이번 시퀀스는 endpoint 1개와 topic 1개만 보여주면 충분합니다.
        registry.addEndpoint("/ws-chat")
            .setAllowedOriginPatterns(*allowedOriginPatterns.split(",").map(String::trim).toTypedArray())
            .withSockJS()
    }
}
