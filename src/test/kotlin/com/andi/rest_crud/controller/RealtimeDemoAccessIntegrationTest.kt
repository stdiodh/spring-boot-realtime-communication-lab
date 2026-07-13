package com.andi.rest_crud.controller

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class RealtimeDemoAccessIntegrationTest @Autowired constructor(
    private val mockMvc: MockMvc
) {

    @Test
    fun `실시간 데모 페이지는 로그인 없이 열 수 있다`() {
        mockMvc.perform(get("/realtime-demo.html"))
            .andExpect(status().isOk)
    }
}
