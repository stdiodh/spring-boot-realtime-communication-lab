package com.andi.realtime.controller

import com.andi.realtime.dto.ChatMessage
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.context.ApplicationListener
import org.springframework.context.annotation.Import
import org.springframework.messaging.converter.JacksonJsonMessageConverter
import org.springframework.messaging.simp.stomp.StompFrameHandler
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.simp.stomp.StompHeaders
import org.springframework.messaging.simp.stomp.StompSession
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter
import org.springframework.web.socket.client.standard.StandardWebSocketClient
import org.springframework.web.socket.messaging.SessionSubscribeEvent
import org.springframework.web.socket.messaging.WebSocketStompClient
import tools.jackson.module.kotlin.jsonMapper
import java.lang.reflect.Type
import java.util.concurrent.BlockingQueue
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CountDownLatch
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.LinkedBlockingQueue
import java.util.concurrent.TimeUnit

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(RealtimeWebSocketIntegrationTest.TopicSubscriptionTracker::class)
class RealtimeWebSocketIntegrationTest {

    @LocalServerPort
    private var port: Int = 0

    @Autowired
    private lateinit var subscriptionTracker: TopicSubscriptionTracker

    private lateinit var stompClient: WebSocketStompClient
    private val sessions = CopyOnWriteArrayList<StompSession>()

    @BeforeEach
    fun setUp() {
        subscriptionTracker.reset()
        stompClient = WebSocketStompClient(StandardWebSocketClient()).apply {
            messageConverter = JacksonJsonMessageConverter(jsonMapper())
        }
    }

    @AfterEach
    fun tearDown() {
        sessions.filter(StompSession::isConnected).forEach { session ->
            runCatching { session.disconnect() }
        }
        stompClient.stop()
        sessions.clear()
    }

    @Test
    fun `두 native WebSocket session이 topic 등록 후 같은 메시지를 받는다`() {
        val clientAMessages = LinkedBlockingQueue<ChatMessage>()
        val clientBMessages = LinkedBlockingQueue<ChatMessage>()
        val clientA = connect()
        val clientB = connect()

        subscribe(clientA, clientAMessages)
        subscribe(clientB, clientBMessages)
        assertTrue(
            subscriptionTracker.awaitSubscriptions(SUBSCRIPTION_TIMEOUT_SECONDS, TimeUnit.SECONDS),
            "두 session의 $TOPIC_DESTINATION 구독이 서버에 등록되지 않았습니다."
        )
        assertEquals(EXPECTED_SUBSCRIBER_COUNT, subscriptionTracker.sessionCount())

        val expected = ChatMessage("client-a", "hello websocket")
        clientA.send(APPLICATION_DESTINATION, expected)

        assertEquals(expected, clientAMessages.poll(MESSAGE_TIMEOUT_SECONDS, TimeUnit.SECONDS))
        assertEquals(expected, clientBMessages.poll(MESSAGE_TIMEOUT_SECONDS, TimeUnit.SECONDS))
    }

    private fun connect(): StompSession {
        val session = stompClient
            .connectAsync(
                "ws://localhost:$port$WEBSOCKET_ENDPOINT",
                object : StompSessionHandlerAdapter() {}
            )
            .get(CONNECT_TIMEOUT_SECONDS, TimeUnit.SECONDS)
        sessions.add(session)
        return session
    }

    private fun subscribe(
        session: StompSession,
        messages: BlockingQueue<ChatMessage>
    ) {
        session.subscribe(TOPIC_DESTINATION, chatMessageHandler(messages))
    }

    private fun chatMessageHandler(
        messages: BlockingQueue<ChatMessage>
    ): StompFrameHandler = object : StompFrameHandler {
        override fun getPayloadType(headers: StompHeaders): Type = ChatMessage::class.java

        override fun handleFrame(headers: StompHeaders, payload: Any?) {
            messages.offer(payload as ChatMessage)
        }
    }

    class TopicSubscriptionTracker : ApplicationListener<SessionSubscribeEvent> {
        private val sessionIds = ConcurrentHashMap.newKeySet<String>()

        @Volatile
        private var subscriptions = CountDownLatch(EXPECTED_SUBSCRIBER_COUNT)

        fun reset() {
            sessionIds.clear()
            subscriptions = CountDownLatch(EXPECTED_SUBSCRIBER_COUNT)
        }

        override fun onApplicationEvent(event: SessionSubscribeEvent) {
            val headers = StompHeaderAccessor.wrap(event.message)
            val sessionId = headers.sessionId ?: return
            if (headers.destination == TOPIC_DESTINATION && sessionIds.add(sessionId)) {
                subscriptions.countDown()
            }
        }

        fun awaitSubscriptions(timeout: Long, unit: TimeUnit): Boolean =
            subscriptions.await(timeout, unit)

        fun sessionCount(): Int = sessionIds.size
    }

    private companion object {
        const val WEBSOCKET_ENDPOINT = "/ws-chat"
        const val APPLICATION_DESTINATION = "/app/chat.send"
        const val TOPIC_DESTINATION = "/topic/chat"
        const val CONNECT_TIMEOUT_SECONDS = 5L
        const val SUBSCRIPTION_TIMEOUT_SECONDS = 5L
        const val MESSAGE_TIMEOUT_SECONDS = 5L
        const val EXPECTED_SUBSCRIBER_COUNT = 2
    }
}
