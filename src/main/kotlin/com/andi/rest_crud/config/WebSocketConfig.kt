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

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        // TODO 1: `/ws-chat` native STOMP endpoint를 등록하고 제공된 Origin allowlist를 적용하세요.
    }

    override fun configureMessageBroker(registry: MessageBrokerRegistry) {
        // TODO 2: application prefix `/app`과 simple broker prefix `/topic`을 설정하세요.
    }

    private fun allowedOrigins(): Array<String> =
        allowedOriginPatterns.split(",").map(String::trim).toTypedArray()
}
