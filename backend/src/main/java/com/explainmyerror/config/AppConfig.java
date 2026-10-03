package com.explainmyerror.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.boot.web.client.RestClientCustomizer;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import java.time.Duration;

@Configuration
public class AppConfig {

    /**
     * Configures extended HTTP timeout for local Ollama LLM execution on CPU.
     */
    @Bean
    public RestClientCustomizer restClientCustomizer() {
        return restClientBuilder -> {
            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout((int) Duration.ofSeconds(30).toMillis());
            factory.setReadTimeout((int) Duration.ofMinutes(5).toMillis());
            restClientBuilder.requestFactory(factory);
        };
    }

    /**
     * Configures the Spring AI ChatClient.
     * The underlying ChatModel is auto-configured by Spring AI based on
     * application.yml (Gemini/OpenAI/Ollama), making the rest of the app provider-agnostic.
     */
    @Bean
    public ChatClient chatClient(ChatModel chatModel) {
        return ChatClient.builder(chatModel).build();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper()
                .registerModule(new JavaTimeModule());
    }
}
